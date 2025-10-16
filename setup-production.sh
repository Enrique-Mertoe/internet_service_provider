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
NC='\033[0m'

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Get current user
CURRENT_USER=$(whoami)

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "=========================================="
echo "   ISP Production Setup"
echo "=========================================="
echo ""

# Check if running with proper mode
if [ "$1" == "install" ]; then
    MODE="install"
elif [ "$1" == "update" ]; then
    MODE="update"
elif [ "$1" == "service" ]; then
    MODE="service"
else
    echo "Usage: $0 {install|update|service}"
    echo ""
    echo "  install  - First time setup (deploy + install service)"
    echo "  update   - Update deployment (pull, build, migrate, restart)"
    echo "  service  - Only install/reinstall systemd service"
    echo ""
    exit 1
fi

# Function: Deploy application
deploy_app() {
    log_info "Deploying application..."

    # Check .env file
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            log_warning "Creating .env from .env.example"
            cp .env.example .env
            log_error "Please configure .env file and run again"
            exit 1
        fi
    fi

    # Setup Python virtual environment
    if [ ! -d ".venv" ]; then
        log_info "Creating virtual environment..."
        python3 -m venv .venv
    fi

    source .venv/bin/activate

    # Install Python dependencies
    log_info "Installing Python dependencies..."
    pip install -q --upgrade pip
    pip install -q -r requirements.txt

    # Install Node dependencies
    log_info "Installing Node.js dependencies..."
    if [ -d "node_modules" ]; then
        npm ci --silent
    else
        npm install --silent
    fi

    # Generate routes
    log_info "Generating Django routes..."
    npm run routes:generate

    # Build Vite assets
    log_info "Building Vite assets..."
    npm run build

    # Run migrations
    log_info "Running migrations..."
    python manage.py migrate --noinput

    # Collect static files
    log_info "Collecting static files..."
    python manage.py collectstatic --noinput --clear

    log_success "Application deployed successfully!"
}

# Function: Install systemd service
install_service() {
    log_info "Installing systemd service..."

    # Create systemd service file
    SERVICE_FILE="/etc/systemd/system/isp-app.service"

    cat << EOF | sudo tee $SERVICE_FILE > /dev/null
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

    # Reload systemd
    log_info "Reloading systemd..."
    sudo systemctl daemon-reload

    # Enable service
    log_info "Enabling service to start on boot..."
    sudo systemctl enable isp-app

    log_success "Service installed successfully!"
}

# Function: Start service
start_service() {
    log_info "Starting isp-app service..."
    sudo systemctl start isp-app
    sleep 2

    if sudo systemctl is-active --quiet isp-app; then
        log_success "Service started successfully!"
        echo ""
        sudo systemctl status isp-app --no-pager
    else
        log_error "Service failed to start!"
        sudo systemctl status isp-app --no-pager
        exit 1
    fi
}

# Function: Restart service
restart_service() {
    log_info "Restarting isp-app service..."
    sudo systemctl restart isp-app
    sleep 2

    if sudo systemctl is-active --quiet isp-app; then
        log_success "Service restarted successfully!"
    else
        log_error "Service failed to restart!"
        sudo systemctl status isp-app --no-pager
        exit 1
    fi
}

# Main execution based on mode
case $MODE in
    install)
        log_info "Running full installation..."
        deploy_app
        install_service
        start_service
        echo ""
        log_success "=========================================="
        log_success "   Installation Complete!"
        log_success "=========================================="
        echo ""
        log_info "Service Commands:"
        echo "  Status:  sudo systemctl status isp-app"
        echo "  Logs:    sudo journalctl -u isp-app -f"
        echo "  Stop:    sudo systemctl stop isp-app"
        echo "  Restart: sudo systemctl restart isp-app"
        echo ""
        log_info "Update Command:"
        echo "  $0 update"
        echo ""
        ;;

    update)
        log_info "Running update deployment..."

        # Optional: Pull from git
        if [ "$2" == "--pull" ]; then
            log_info "Pulling latest changes..."
            git pull
        fi

        deploy_app

        # Restart service if it exists
        if sudo systemctl list-unit-files | grep -q "isp-app.service"; then
            restart_service
        else
            log_warning "Service not installed. Run '$0 install' first or '$0 service' to install service only."
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