#!/bin/bash

################################################################################
# PostgreSQL Permissions Fix Script
# Fixes "permission denied for schema public" error in Django
################################################################################

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║${NC}  PostgreSQL Permissions Fix for Django                   ${BLUE}║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get database name
read -p "Enter database name: " db_name

# Get username
read -p "Enter username: " username

if [ -z "$db_name" ] || [ -z "$username" ]; then
    print_error "Database name and username cannot be empty!"
    exit 1
fi

echo ""
print_info "Fixing permissions for user '$username' on database '$db_name'..."
echo ""

# Fix permissions
print_info "1. Granting database privileges..."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $username;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Database privileges granted"
else
    print_error "Failed to grant database privileges"
fi

print_info "2. Granting schema privileges..."
sudo -u postgres psql -d "$db_name" -c "GRANT ALL ON SCHEMA public TO $username;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Schema privileges granted"
else
    print_error "Failed to grant schema privileges"
fi

print_info "3. Granting table creation privileges..."
sudo -u postgres psql -d "$db_name" -c "GRANT CREATE ON SCHEMA public TO $username;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Create privileges granted"
else
    print_error "Failed to grant create privileges"
fi

print_info "4. Granting usage privileges..."
sudo -u postgres psql -d "$db_name" -c "GRANT USAGE ON SCHEMA public TO $username;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Usage privileges granted"
else
    print_error "Failed to grant usage privileges"
fi

print_info "5. Setting default privileges for future tables..."
sudo -u postgres psql -d "$db_name" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $username;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Default privileges set"
else
    print_warning "Could not set default privileges (may not be needed)"
fi

print_info "6. Making user the owner of the database (recommended)..."
sudo -u postgres psql -c "ALTER DATABASE $db_name OWNER TO $username;" 2>/dev/null
if [ $? -eq 0 ]; then
    print_success "Database ownership transferred to $username"
else
    print_warning "Could not transfer ownership"
fi

echo ""
print_success "Permissions fix completed!"
echo ""
print_info "You can now run Django migrations:"
echo -e "${GREEN}  python manage.py migrate${NC}"
echo ""