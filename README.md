# ISP Management Application

Production-ready Django + Vite ISP management system.

## Quick Start

### First Time Setup (Install as System Service)

```bash
git clone <your-repo>
cd isp-main
./setup-production.sh install
```

That's it! Your app is now running as a system service.

### Update Deployment

```bash
# Without pulling from git
./setup-production.sh update

# With git pull
./setup-production.sh update --pull
```

### Only Install/Reinstall Service

```bash
./setup-production.sh service
```

## Service Management

```bash
# Check status
sudo systemctl status isp-app

# View logs
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

## Requirements

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Redis 6+

## What Happens During Deployment

1. Creates Python virtual environment
2. Installs Python dependencies
3. Installs Node.js dependencies
4. Generates Django routes for frontend
5. Builds Vite assets (production optimized)
6. Runs database migrations
7. Collects static files
8. Installs/configures systemd service
9. Starts the application

## Production Workflow

```bash
# 1. SSH to server
ssh user@server

# 2. Go to project
cd isp-main

# 3. Pull changes
git pull

# 4. Update and restart
./setup-production.sh update
```

## Nginx Configuration (Optional)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /path/to/isp-main/staticfiles/;
        expires 30d;
    }
}
```