#!/bin/bash

# =============================================================================
# ISP Django Application - Production Setup Script
# This script sets up the ISP application environment with PostgreSQL & Redis
# Usage: sudo ./setup-production.sh [OPTIONS]
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="isp_app"
APP_USER="isp_user"
CURRENT_DIR="$(pwd)"
APP_DIR="/opt/isp_app"  # Production directory
SOURCE_DIR="$CURRENT_DIR"  # Where the script is run from
VENV_DIR="$APP_DIR/venv"
LOG_DIR="/var/log/isp_app"
CONFIG_DIR="/etc/isp_app"
SYSTEMD_DIR="/etc/systemd/system"

# Environment variables from .env
ENV_FILE="$APP_DIR/.env"

# Django settings module
DJANGO_SETTINGS_MODULE=""

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${CYAN}=== $1 ===${NC}"
}

show_help() {
    cat << EOF
${CYAN}ISP Application Setup Script${NC}

${YELLOW}USAGE:${NC}
    sudo $0 [MODE]
    sudo $0 [OPTIONS]

${YELLOW}MODES:${NC}
    ${GREEN}--all${NC}                   Run complete setup (default - includes file copy)
    ${GREEN}--update${NC}                Update deployment (copy files, rebuild, restart)
    ${GREEN}--sync${NC}                  Only sync files from source to /opt/isp_app

${YELLOW}COMPONENT OPTIONS:${NC}
    ${GREEN}--help, -h${NC}              Show this help message
    ${GREEN}--packages${NC}              Install system packages only
    ${GREEN}--user${NC}                  Create application user only
    ${GREEN}--directories${NC}           Create directories only
    ${GREEN}--python-app${NC}            Install Python application only
    ${GREEN}--environment${NC}           Setup environment configuration only
    ${GREEN}--nginx${NC}                 Setup Nginx only
    ${GREEN}--systemd${NC}               Setup systemd services only
    ${GREEN}--init-db${NC}               Initialize Django database only
    ${GREEN}--start-services${NC}        Start services only

${YELLOW}TYPICAL WORKFLOW:${NC}
    # First time setup
    sudo $0 --all

    # After git pull or .env changes
    sudo $0 --update

    # Only sync files (no rebuild)
    sudo $0 --sync

${YELLOW}NOTES:${NC}
    - Script can be run multiple times safely
    - ALWAYS copies files from current directory to /opt/isp_app
    - Creates dedicated app user and runs as that user
    - Uses PostgreSQL and Redis
    - --update mode: copies files, rebuilds frontend, restarts service

EOF
}

check_root() {
    if [[ $EUID -ne 0 ]]; then
        print_error "This script must be run as root (use sudo)"
        exit 1
    fi
}

copy_application_files() {
    print_header "Copying Application Files"

    # Check if rsync is installed
    if ! command -v rsync &> /dev/null; then
        print_status "Installing rsync..."
        apt install -y rsync || yum install -y rsync
    fi

    # Create app directory if it doesn't exist
    if [[ ! -d "$APP_DIR" ]]; then
        print_status "Creating directory: $APP_DIR"
        mkdir -p "$APP_DIR"
    fi

    print_status "Copying files from $SOURCE_DIR to $APP_DIR..."

    # Copy all files except venv, node_modules, __pycache__, and .git
    rsync -av --delete \
          --exclude='venv' \
          --exclude='.venv' \
          --exclude='node_modules' \
          --exclude='__pycache__' \
          --exclude='*.pyc' \
          --exclude='.git' \
          --exclude='*.log' \
          --exclude='db.sqlite3' \
          --exclude='staticfiles' \
          --exclude='isp/static/dist' \
          "$SOURCE_DIR/" "$APP_DIR/" || {
        print_error "Failed to copy application files"
        exit 1
    }

    print_success "Application files copied to $APP_DIR"
}

check_env_file() {
    print_header "Checking .env file"

    # Check if .env exists in source
    if [[ ! -f "$SOURCE_DIR/.env" ]] && [[ ! -f "$SOURCE_DIR/.env.example" ]]; then
        print_error ".env or .env.example file not found in source directory"
        exit 1
    fi

    # Copy .env if it exists, otherwise use .env.example
    if [[ -f "$SOURCE_DIR/.env" ]]; then
        cp "$SOURCE_DIR/.env" "$ENV_FILE"
        print_success ".env file copied to $APP_DIR"
    elif [[ -f "$SOURCE_DIR/.env.example" ]]; then
        cp "$SOURCE_DIR/.env.example" "$ENV_FILE"
        print_warning "Created .env from .env.example"
        print_warning "Please configure $ENV_FILE before running the app"
    fi
}

detect_os() {
    if [[ -f /etc/os-release ]]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "Cannot detect operating system"
        exit 1
    fi

    print_status "Detected OS: $OS $VER"
}

install_system_packages() {
    print_header "Installing system packages"

    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt update

        # Install Node.js 22.x from NodeSource
        print_status "Installing Node.js 22.x..."
        curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

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
            nginx \
            git \
            curl \
            wget \
            build-essential \
            libssl-dev \
            libffi-dev \
            pkg-config \
            supervisor \
            logrotate \
            rsync

    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]] || [[ "$OS" == *"Rocky"* ]]; then
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
            libffi-devel \
            rsync

        # Initialize PostgreSQL on CentOS/RHEL
        postgresql-setup initdb || true
    else
        print_error "Unsupported operating system: $OS"
        exit 1
    fi

    print_success "System packages installed"
}

create_user() {
    print_header "Creating application user"

    if ! id "$APP_USER" &>/dev/null; then
        # Create system user without login
        useradd --system --shell /bin/bash --no-create-home "$APP_USER"
        usermod -a -G www-data "$APP_USER" 2>/dev/null || true
        print_success "User $APP_USER created"
    else
        print_warning "User $APP_USER already exists"
    fi

    # Ensure user has access to app directory
    if [[ -d "$APP_DIR" ]]; then
        chown -R "$APP_USER:$APP_USER" "$APP_DIR" 2>/dev/null || true
        chmod -R 755 "$APP_DIR"
    fi
}

create_directories() {
    print_header "Creating application directories"

    # Verify APP_DIR exists
    if [[ ! -d "$APP_DIR" ]]; then
        print_error "Application directory does not exist: $APP_DIR"
        print_error "Files should be copied first"
        exit 1
    fi

    print_status "Application directory: $APP_DIR"

    # Create system directories
    mkdir -p "$LOG_DIR"
    mkdir -p "$CONFIG_DIR"
    mkdir -p "$LOG_DIR/nginx"
    mkdir -p "$LOG_DIR/gunicorn"
    mkdir -p "$CONFIG_DIR/nginx"

    # Create app directories
    mkdir -p "$APP_DIR/staticfiles"
    mkdir -p "$APP_DIR/media"
    mkdir -p "$APP_DIR/logs"
    mkdir -p "$APP_DIR/.npm"
    mkdir -p "$APP_DIR/.npm-global"

    # Set permissions
    chown -R "$APP_USER:$APP_USER" "$LOG_DIR"
    chown -R "$APP_USER:$APP_USER" "$APP_DIR/logs"
    chown -R "$APP_USER:$APP_USER" "$APP_DIR/staticfiles" 2>/dev/null || true
    chown -R "$APP_USER:$APP_USER" "$APP_DIR/media" 2>/dev/null || true
    chown -R "$APP_USER:$APP_USER" "$APP_DIR/.npm" 2>/dev/null || true
    chown -R "$APP_USER:$APP_USER" "$APP_DIR/.npm-global" 2>/dev/null || true

    # Ensure app user can access the app directory
    chgrp -R "$APP_USER" "$APP_DIR" 2>/dev/null || true
    chmod -R g+rX "$APP_DIR" 2>/dev/null || true

    print_success "Directories created and permissions set"
}

start_system_services() {
    print_header "Starting system services"

    # PostgreSQL
    systemctl start postgresql || systemctl start postgresql@*-main || true
    systemctl enable postgresql || systemctl enable postgresql@*-main || true

    # Redis
    systemctl start redis-server || systemctl start redis || true
    systemctl enable redis-server || systemctl enable redis || true

    print_success "System services started"
}

install_python_app() {
    print_header "Installing Python application"

    # Ensure app directory exists
    if [[ ! -d "$APP_DIR" ]]; then
        print_error "Application directory does not exist: $APP_DIR"
        exit 1
    fi

    # Fix ownership of app directory
    print_status "Setting correct permissions on $APP_DIR"
    chown -R "$APP_USER:$APP_USER" "$APP_DIR" 2>/dev/null || {
        print_warning "Could not change ownership of $APP_DIR"
        print_status "Attempting to continue anyway..."
    }

    # Create virtual environment if it doesn't exist
    if [[ ! -d "$VENV_DIR" ]]; then
        print_status "Creating virtual environment at $VENV_DIR"

        # Create venv as root first, then fix permissions
        python3 -m venv "$VENV_DIR" || {
            print_error "Failed to create virtual environment"
            exit 1
        }

        # Fix ownership
        chown -R "$APP_USER:$APP_USER" "$VENV_DIR"
        print_success "Virtual environment created"
    else
        print_warning "Virtual environment already exists"
        chown -R "$APP_USER:$APP_USER" "$VENV_DIR"
    fi

    # Install dependencies
    print_status "Installing Python packages..."

    # Run as app user
    sudo -u "$APP_USER" -H bash << EOF
cd "$APP_DIR" || exit 1
source "$VENV_DIR/bin/activate" || exit 1

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install from requirements.txt
if [[ -f "requirements.txt" ]]; then
    pip install -r requirements.txt
    echo "Requirements installed from requirements.txt"
else
    echo "No requirements.txt found"
    exit 1
fi

echo "Python application installed successfully"
EOF

    if [[ $? -eq 0 ]]; then
        print_success "Python application installed"
    else
        print_error "Failed to install Python packages"
        exit 1
    fi
}

detect_django_settings() {
    print_header "Detecting Django settings module"

    # Try to find Django project name
    local project_name=""
    if [[ -f "$APP_DIR/manage.py" ]]; then
        project_name=$(grep "DJANGO_SETTINGS_MODULE" "$APP_DIR/manage.py" 2>/dev/null | sed -n "s/.*['\"]\\([^'\"]*\\)\\.settings['\"].*/\\1/p" | head -n1)
    fi

    if [[ -z "$project_name" ]]; then
        # Try to find by looking for wsgi.py
        project_name=$(find "$APP_DIR" -maxdepth 2 -name "wsgi.py" -type f 2>/dev/null | head -n1 | xargs dirname | xargs basename)
    fi

    if [[ -n "$project_name" ]]; then
        if [[ -f "$APP_DIR/$project_name/settings.py" ]]; then
            DJANGO_SETTINGS_MODULE="$project_name.settings"
            print_success "Found settings: $DJANGO_SETTINGS_MODULE"
        else
            DJANGO_SETTINGS_MODULE="$project_name.settings"
            print_warning "Settings file not found, using default: $DJANGO_SETTINGS_MODULE"
        fi
    else
        DJANGO_SETTINGS_MODULE="internet_service_provider.settings"
        print_warning "Could not detect Django project, using default: $DJANGO_SETTINGS_MODULE"
    fi
}

build_frontend() {
    print_header "Building frontend assets"

    if [[ ! -f "$APP_DIR/package.json" ]]; then
        print_warning "No package.json found, skipping frontend build"
        return 0
    fi

    sudo -u "$APP_USER" bash << EOF
cd "$APP_DIR" || exit 1
source "$VENV_DIR/bin/activate" || exit 1

# Set npm cache to app directory to avoid permission issues
export npm_config_cache="$APP_DIR/.npm"
export HOME="$APP_DIR"

# Generate routes if command exists (optional, skip if fails)
if grep -q "routes:generate" package.json; then
    echo "Generating Django routes..."
    npm run routes:generate || echo "Route generation skipped (command may not exist)"
fi

# Build frontend
echo "Building frontend assets..."
if [ -d "node_modules" ]; then
    npm ci --silent
else
    npm install --silent
fi
npm run build

echo "Frontend built successfully"
EOF

    print_success "Frontend assets built"
}

setup_nginx() {
    print_header "Setting up Nginx"

    # Create Nginx configuration
    cat > "$CONFIG_DIR/nginx/isp_app.conf" << EOF
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
        alias $APP_DIR/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media files
    location /media/ {
        alias $APP_DIR/media/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Django application
    location / {
        proxy_pass http://isp_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Logging
    access_log $LOG_DIR/nginx/access.log;
    error_log $LOG_DIR/nginx/error.log;
}
EOF

    # Link configuration
    ln -sf "$CONFIG_DIR/nginx/isp_app.conf" /etc/nginx/sites-available/isp_app
    ln -sf /etc/nginx/sites-available/isp_app /etc/nginx/sites-enabled/isp_app

    # Remove default site
    rm -f /etc/nginx/sites-enabled/default

    # Test configuration
    nginx -t

    systemctl restart nginx
    systemctl enable nginx

    print_success "Nginx configured"
}

setup_systemd_services() {
    print_header "Setting up systemd services"

    # Detect wsgi module
    local wsgi_module=$(echo "$DJANGO_SETTINGS_MODULE" | cut -d'.' -f1).wsgi:application

    # Django application service
    cat > "$SYSTEMD_DIR/isp-app.service" << EOF
[Unit]
Description=ISP Django Application
After=network.target postgresql.service redis.service
Wants=postgresql.service redis.service

[Service]
Type=notify
User=$APP_USER
Group=$APP_USER
WorkingDirectory=$APP_DIR
Environment=PATH=$VENV_DIR/bin
Environment=DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
ExecStart=$VENV_DIR/bin/gunicorn --bind 127.0.0.1:8000 --workers 3 --threads 2 --timeout 120 --log-level info --capture-output --enable-stdio-inheritance --access-logfile $LOG_DIR/gunicorn/access.log --error-logfile $LOG_DIR/gunicorn/error.log $wsgi_module
ExecReload=/bin/kill -s HUP \$MAINPID
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable service
    systemctl daemon-reload
    systemctl enable isp-app

    print_success "Systemd service configured with $DJANGO_SETTINGS_MODULE"
}

initialize_database() {
    print_header "Initializing Django database"

    sudo -u "$APP_USER" bash << EOF
cd "$APP_DIR"
source "$VENV_DIR/bin/activate"
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE

# Run Django migrations
if [ -f manage.py ]; then
    echo "Creating migrations..."
    python manage.py makemigrations --noinput || echo "No new migrations to create"

    echo "Applying migrations..."
    python manage.py migrate --noinput

    echo "Collecting static files..."
    python manage.py collectstatic --noinput --clear || echo "Static files collection skipped"

    echo "Django database initialization completed"
else
    echo "manage.py not found. Please check your project structure."
    exit 1
fi
EOF

    print_success "Django database initialized with $DJANGO_SETTINGS_MODULE"
}

start_services() {
    print_header "Starting services"

    systemctl start isp-app

    # Wait for service to start
    sleep 5

    # Check service status
    if systemctl is-active --quiet isp-app; then
        print_success "ISP App service started"
    else
        print_warning "ISP App service may have issues - check logs with: journalctl -u isp-app"
    fi

    # Check nginx
    if systemctl is-active --quiet nginx; then
        print_success "Nginx is running"
    else
        print_warning "Nginx may have issues - check logs with: journalctl -u nginx"
    fi
}

# Update mode - for after git pull or .env changes
update_deployment() {
    print_header "Updating Deployment"

    # Always copy files first
    copy_application_files
    check_env_file

    # Detect Django settings
    detect_django_settings

    # Install/update Python dependencies
    print_status "Updating Python dependencies..."
    sudo -u "$APP_USER" -H bash << EOF
cd "$APP_DIR" || exit 1
source "$VENV_DIR/bin/activate" || exit 1
pip install -r requirements.txt
EOF

    # Install/update Node dependencies and rebuild
    if [[ -f "$APP_DIR/package.json" ]]; then
        print_status "Updating Node dependencies..."
        sudo -u "$APP_USER" bash << EOF
cd "$APP_DIR" || exit 1
npm install --silent
EOF
        build_frontend
    fi

    # Run migrations
    print_status "Running migrations..."
    sudo -u "$APP_USER" bash << EOF
cd "$APP_DIR"
source "$VENV_DIR/bin/activate"
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear
EOF

    # Restart service
    if systemctl is-active --quiet isp-app; then
        print_status "Restarting service..."
        systemctl restart isp-app
        sleep 3
        if systemctl is-active --quiet isp-app; then
            print_success "Service restarted successfully!"
        else
            print_error "Service failed to restart!"
            print_status "Check logs with: journalctl -u isp-app -xe"
        fi
    else
        print_warning "Service not running, starting it..."
        systemctl start isp-app
    fi

    print_success "Deployment updated!"
}

# Main execution function
execute_setup() {
    local run_all=false
    local run_update=false
    local run_sync=false
    local components=()

    # Parse arguments - default to --all if no args
    if [[ $# -eq 0 ]]; then
        run_all=true
    fi

    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --all)
                run_all=true
                shift
                ;;
            --update)
                run_update=true
                shift
                ;;
            --sync)
                run_sync=true
                shift
                ;;
            --packages|--user|--directories|--python-app|--environment|--nginx|--systemd|--init-db|--start-services)
                components+=("${1#--}")
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
        esac
    done

    # Always run these checks first
    check_root
    detect_os

    # Sync mode - only copy files
    if [[ "$run_sync" == true ]]; then
        print_status "Syncing files only..."
        copy_application_files
        check_env_file
        print_success "Files synced to $APP_DIR"
        exit 0
    fi

    # Update mode - copy files and update deployment
    if [[ "$run_update" == true ]]; then
        update_deployment
        exit 0
    fi

    # Full setup mode
    if [[ "$run_all" == true ]]; then
        print_status "Running complete setup..."
        copy_application_files
        check_env_file
        install_system_packages
        create_user
        create_directories
        start_system_services
        install_python_app
        detect_django_settings
        build_frontend
        setup_nginx
        setup_systemd_services
        initialize_database
        start_services
    # Component mode
    elif [[ ${#components[@]} -gt 0 ]]; then
        print_status "Running selected components: ${components[*]}"

        # Always copy files first when running components
        copy_application_files
        check_env_file

        # Detect Django settings if needed
        if [[ " ${components[*]} " =~ " systemd " ]] || [[ " ${components[*]} " =~ " init-db " ]]; then
            detect_django_settings
        fi

        for component in "${components[@]}"; do
            case $component in
                packages) install_system_packages ;;
                user) create_user ;;
                directories) create_directories ;;
                python-app)
                    install_python_app
                    ;;
                environment) detect_django_settings ;;
                nginx) setup_nginx ;;
                systemd) setup_systemd_services ;;
                init-db) initialize_database ;;
                start-services) start_services ;;
            esac
        done
    fi

    print_header "Setup completed successfully!"
    print_status "Your ISP application is ready at: http://localhost"
    print_status "Application directory: $APP_DIR"
    print_status "Check service status with: systemctl status isp-app"
    print_status "View logs with: journalctl -u isp-app -f"
}

# Run setup if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    execute_setup "$@"
fi