# ISP Management Application

Production-ready Django + Vite ISP management system.

## Quick Start - ONE Command Setup!

```bash
# Clone repository
git clone <your-repo>
cd isp-main

# Run setup (installs everything + starts as system service)
sudo ./setup-production.sh install
```

**That's it!** The script automatically:
- ✅ Installs Python, Node.js, PostgreSQL, Redis, Nginx
- ✅ Creates Python virtual environment
- ✅ Installs all dependencies
- ✅ Builds Vite frontend assets
- ✅ Runs migrations & collects static files
- ✅ Installs and starts systemd service
- ✅ Optionally configures Nginx reverse proxy

Your app is now running at `http://your-server:8000`

## Usage

### First Time Setup
```bash
sudo ./setup-production.sh install
```

### Update Deployment (After Git Pull)
```bash
# Update only
sudo ./setup-production.sh update

# Pull from git and update
sudo ./setup-production.sh update --pull
```

### Reinstall Service Only
```bash
sudo ./setup-production.sh service
```

## Service Management

```bash
# Check status
sudo systemctl status isp-app

# View logs (live)
sudo journalctl -u isp-app -f

# Restart
sudo systemctl restart isp-app

# Stop
sudo systemctl stop isp-app

# Start
sudo systemctl start isp-app
```

## Configuration

Edit `.env` file for configuration:
- Database settings (PostgreSQL)
- Redis settings
- Mikrotik API settings
- Django SECRET_KEY
- FERNET_KEY (generate with: `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"`)

## System Requirements

The script automatically installs:
- Python 3.8+ with pip and venv
- Node.js 16+ with npm
- PostgreSQL 12+ with contrib
- Redis 6+
- Nginx (optional)
- Build tools (gcc, make, etc.)

Supported OS:
- Ubuntu / Debian
- CentOS / RHEL / Rocky Linux

## What the Script Does

**On `install` mode:**
1. Detects your operating system
2. Installs all system packages (Python, Node, PostgreSQL, Redis, etc.)
3. Starts PostgreSQL and Redis services
4. Creates Python virtual environment
5. Installs Python dependencies from requirements.txt
6. Installs Node.js dependencies from package.json
7. Generates Django routes for frontend
8. Builds Vite assets (production optimized)
9. Runs database migrations
10. Collects static files
11. Creates systemd service
12. Optionally configures Nginx
13. Starts the application service
14. Optionally creates Django superuser

**On `update` mode:**
1. Optionally pulls from git (with `--pull` flag)
2. Installs/updates dependencies
3. Generates routes
4. Builds frontend assets
5. Runs migrations
6. Collects static files
7. Restarts the service

## Production Workflow

```bash
# 1. SSH to server
ssh user@server

# 2. Go to project directory
cd /home/mca/Music/isp/isp-main

# 3. Pull latest changes
git pull

# 4. Update and restart (one command!)
sudo ./setup-production.sh update
```

## Features

- **Zero Configuration**: Script handles everything
- **System Service**: Auto-starts on boot, auto-restarts on crash
- **Production Ready**: Gunicorn WSGI server with multiple workers
- **Nginx Support**: Optional reverse proxy setup
- **No Git Bloat**: Built assets are NOT committed (like Laravel)
- **Smart Detection**: Detects OS and installs correct packages
- **Safe Updates**: Runs as your user, not root (except service installation)

## Troubleshooting

### Service won't start
```bash
# Check logs
sudo journalctl -u isp-app -xe

# Check if port 8000 is available
sudo netstat -tulpn | grep 8000
```

### PostgreSQL connection errors
Edit `.env` file and configure database credentials

### Redis connection errors
```bash
# Start Redis
sudo systemctl start redis-server

# Check status
sudo systemctl status redis-server
```

### Frontend not building
```bash
# Manually build
npm install
npm run build
```