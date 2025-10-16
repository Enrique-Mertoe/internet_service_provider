#!/bin/bash

################################################################################
# ISP Production Setup Script
# One script to deploy and run as a system service
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Get current user (before sudo)
if [ -n "$SUDO_USER" ]; then
    CURRENT_USER="$SUDO_USER"
else
    CURRENT_USER=$(whoami)
fi

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_header() { echo -e "${CYAN}=== $1 ===${NC}"; }

echo "=========================================="
echo "   ISP Production Setup"
echo "=========================================="
echo ""

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

# Detect OS
detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        log_error "Cannot detect operating system"
        exit 1
    fi
    log_info "Detected OS: $OS $VER"
}

# Check if running with proper mode
if [ "$1" == "install" ]; then
    MODE="install"
    check_root
    detect_os
elif [ "$1" == "update" ]; then
    MODE="update"
    check_root
elif [ "$1" == "service" ]; then
    MODE="service"
    check_root
else
    echo "Usage: sudo $0 {install|update|service}"
    echo ""
    echo "  install  - First time setup (system packages + deploy + service)"
    echo "  update   - Update deployment (pull, build, migrate, restart)"
    echo "  service  - Only install/reinstall systemd service"
    echo ""
    exit 1
fi

# Function: Install system packages
install_system_packages() {
    log_header "Installing System Packages"

    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        log_info "Updating package lists..."
        apt update -qq

        log_info "Installing required packages..."
        apt install -y \
            python3 \
            python3-pip \
            python3-venv \
            python3-dev \
            postgresql \
            postgresql-contrib \
            libpq-dev \
            redis-server \
            nodejs \
            npm \
            nginx \
            git \
            curl \
            wget \
            build-essential \
            libssl-dev \
            libffi-dev \
            pkg-config \
            supervisor \
            logrotate

    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Rocky"* ]]; then
        log_info "Installing required packages..."
        yum update -y
        yum groupinstall -y "Development Tools"
        yum install -y \
            python3 \
            python3-pip \
            python3-devel \
            postgresql-server \
            postgresql-devel \
            redis \
            nodejs \
            npm \
            nginx \
            git \
            curl \
            wget \
            openssl-devel \
            libffi-devel

        # Initialize PostgreSQL on CentOS/RHEL
        postgresql-setup initdb || true
    else
        log_error "Unsupported operating system: $OS"
        exit 1
    fi

    log_success "System packages installed"
}

# Function: Start required services
start_system_services() {
    log_header "Starting System Services"

    # PostgreSQL
    systemctl start postgresql || systemctl start postgresql@*-main || true
    systemctl enable postgresql || systemctl enable postgresql@*-main || true

    # Redis
    systemctl start redis-server || systemctl start redis || true
    systemctl enable redis-server || systemctl enable redis || true

    log_success "System services started"
}

# Function: Deploy application
deploy_app() {
    log_header "Deploying Application"

    # Check .env file
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            log_warning "Creating .env from .env.example"
            cp .env.example .env
            chown $CURRENT_USER:$CURRENT_USER .env
            log_error "Please configure .env file and run again"
            exit 1
        fi
    fi

    # Setup Python virtual environment as the actual user
    if [ ! -d ".venv" ]; then
        log_info "Creating virtual environment..."
        sudo -u $CURRENT_USER python3 -m venv .venv
    fi

    # Fix ownership
    chown -R $CURRENT_USER:$CURRENT_USER .venv 2>/dev/null || true

    # Install dependencies as the actual user
    log_info "Installing Python dependencies..."
    sudo -u $CURRENT_USER bash << 'PYEOF'
source .venv/bin/activate
pip install -q --upgrade pip setuptools wheel
pip install -q -r requirements.txt
PYEOF

    # Install Node dependencies
    log_info "Installing Node.js dependencies..."
    sudo -u $CURRENT_USER bash << 'NODEEOF'
if [ -d "node_modules" ]; then
    npm ci --silent
else
    npm install --silent
fi
NODEEOF

    # Generate routes
    log_info "Generating Django routes..."
    sudo -u $CURRENT_USER bash << 'ROUTEEOF'
source .venv/bin/activate
npm run routes:generate
ROUTEEOF

    # Build Vite assets
    log_info "Building Vite assets..."
    sudo -u $CURRENT_USER npm run build

    # Run migrations
    log_info "Running migrations..."
    sudo -u $CURRENT_USER bash << 'MIGRATEEOF'
source .venv/bin/activate
python manage.py migrate --noinput
MIGRATEEOF

    # Collect static files
    log_info "Collecting static files..."
    sudo -u $CURRENT_USER bash << 'STATICEOF'
source .venv/bin/activate
python manage.py collectstatic --noinput --clear
STATICEOF

    log_success "Application deployed successfully!"
}

# Function: Install systemd service
install_service() {
    log_header "Installing Systemd Service"

    # Create systemd service file
    SERVICE_FILE="/etc/systemd/system/isp-app.service"

    cat << EOF > $SERVICE_FILE
[Unit]
Description=ISP Management Application
After=network.target postgresql.service redis.service

[Service]
Type=notify
User=$CURRENT_USER
Group=$CURRENT_USER
WorkingDirectory=$SCRIPT_DIR
Environment="PATH=$SCRIPT_DIR/.venv/bin"

ExecStart=$SCRIPT_DIR/.venv/bin/gunicorn \\
    internet_service_provider.wsgi:application \\
    --bind 0.0.0.0:8000 \\
    --workers 3 \\
    --threads 2 \\
    --timeout 120 \\
    --access-logfile - \\
    --error-logfile - \\
    --log-level info

ExecReload=/bin/kill -s HUP \$MAINPID
KillMode=mixed
TimeoutStopSec=5
PrivateTmp=true

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    # Set correct permissions
    chmod 644 $SERVICE_FILE

    # Reload systemd
    log_info "Reloading systemd..."
    systemctl daemon-reload

    # Enable service
    log_info "Enabling service to start on boot..."
    systemctl enable isp-app

    log_success "Service installed successfully!"
}

# Function: Setup Nginx (optional)
setup_nginx() {
    log_header "Setting up Nginx"

    # Create Nginx configuration
    cat > /etc/nginx/sites-available/isp-app << 'EOF'
upstream isp_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name _;

    client_max_body_size 50M;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Static files
    location /static/ {
        alias /home/$CURRENT_USER/Music/isp/isp-main/staticfiles/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Django application
    location / {
        proxy_pass http://isp_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

    # Enable site
    ln -sf /etc/nginx/sites-available/isp-app /etc/nginx/sites-enabled/isp-app

    # Remove default site
    rm -f /etc/nginx/sites-enabled/default

    # Test and reload nginx
    nginx -t && systemctl reload nginx

    log_success "Nginx configured"
}

# Function: Start service
start_service() {
    log_info "Starting isp-app service..."
    systemctl start isp-app
    sleep 2

    if systemctl is-active --quiet isp-app; then
        log_success "Service started successfully!"
        echo ""
        systemctl status isp-app --no-pager
    else
        log_error "Service failed to start!"
        systemctl status isp-app --no-pager
        exit 1
    fi
}

# Function: Restart service
restart_service() {
    log_info "Restarting isp-app service..."
    systemctl restart isp-app
    sleep 2

    if systemctl is-active --quiet isp-app; then
        log_success "Service restarted successfully!"
    else
        log_error "Service failed to restart!"
        systemctl status isp-app --no-pager
        exit 1
    fi
}

# Main execution based on mode
case $MODE in
    install)
        log_info "Running full installation..."
        echo ""

        # Install system packages
        install_system_packages

        # Start system services
        start_system_services

        # Deploy application
        deploy_app

        # Install systemd service
        install_service

        # Optional: Setup Nginx
        read -p "Do you want to setup Nginx as reverse proxy? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            setup_nginx
        fi

        # Start the app service
        start_service

        # Create superuser prompt
        echo ""
        read -p "Do you want to create a Django superuser? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo -u $CURRENT_USER bash << 'SUPEREOF'
source .venv/bin/activate
python manage.py createsuperuser
SUPEREOF
        fi

        echo ""
        log_success "=========================================="
        log_success "   Installation Complete!"
        log_success "=========================================="
        echo ""
        log_info "Application URL:"
        echo "  http://$(hostname -I | awk '{print $1}'):8000"
        echo "  http://localhost:8000 (if Nginx: http://localhost)"
        echo ""
        log_info "Service Commands:"
        echo "  Status:  sudo systemctl status isp-app"
        echo "  Logs:    sudo journalctl -u isp-app -f"
        echo "  Stop:    sudo systemctl stop isp-app"
        echo "  Restart: sudo systemctl restart isp-app"
        echo ""
        log_info "Update Command:"
        echo "  sudo $0 update"
        echo ""
        log_warning "Don't forget to configure PostgreSQL database in .env file!"
        echo ""
        ;;

    update)
        log_info "Running update deployment..."
        echo ""

        # Optional: Pull from git
        if [ "$2" == "--pull" ]; then
            log_info "Pulling latest changes..."
            sudo -u $CURRENT_USER git pull
        fi

        # Deploy application
        deploy_app

        # Restart service if it exists
        if systemctl list-unit-files | grep -q "isp-app.service"; then
            restart_service
        else
            log_warning "Service not installed. Run 'sudo $0 install' first"
        fi

        log_success "Update complete!"
        ;;

    service)
        log_info "Installing service only..."
        install_service

        read -p "Do you want to start the service now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            start_service
        else
            log_info "Service installed but not started."
            log_info "Start with: sudo systemctl start isp-app"
        fi
        ;;
esac