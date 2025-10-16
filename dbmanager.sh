#!/bin/bash

################################################################################
# Database Manager - PostgreSQL & MySQL/MariaDB Management Script
# A comprehensive tool for managing databases, users, and quick setup wizards
################################################################################

# Configuration
CONFIG_DIR="$HOME/.dbmanager"
POSTGRES_CONFIG="$CONFIG_DIR/postgres.json"
MYSQL_CONFIG="$CONFIG_DIR/mysql.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

################################################################################
# Utility Functions
################################################################################

print_header() {
    clear
    echo -e "${CYAN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}║${WHITE}          Database Manager v1.0                           ${CYAN}║${NC}"
    echo -e "${CYAN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${CYAN}║${NC}  Manage PostgreSQL & MySQL/MariaDB with ease             ${CYAN}║${NC}"
    echo -e "${CYAN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

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

pause() {
    echo ""
    read -p "Press Enter to continue..."
}

generate_random_username() {
    local adjectives=("swift" "bright" "cosmic" "digital" "quantum" "cyber" "smart" "rapid" "prime" "alpha" "beta" "omega" "shadow" "crystal" "golden")
    local nouns=("user" "admin" "dev" "api" "client" "service" "app" "system" "core" "node" "worker" "agent" "bot")

    local adj=${adjectives[$RANDOM % ${#adjectives[@]}]}
    local noun=${nouns[$RANDOM % ${#nouns[@]}]}
    local num=$(($RANDOM % 1000))

    echo "${adj}_${noun}${num}"
}

generate_random_dbname() {
    local prefixes=("app" "web" "api" "service" "data" "system" "main" "core" "prod" "dev" "test" "project")
    local suffixes=("db" "database" "data" "store" "warehouse" "hub" "vault" "repo")

    local prefix=${prefixes[$RANDOM % ${#prefixes[@]}]}
    local suffix=${suffixes[$RANDOM % ${#suffixes[@]}]}
    local num=$(($RANDOM % 1000))

    echo "${prefix}_${suffix}${num}"
}

generate_random_password() {
    local length=16
    # Generate a secure random password with letters, numbers, and special characters
    tr -dc 'A-Za-z0-9!@#$%^&*' < /dev/urandom | head -c $length
}

################################################################################
# Configuration Management
################################################################################

init_config() {
    if [ ! -d "$CONFIG_DIR" ]; then
        mkdir -p "$CONFIG_DIR"
        print_success "Created config directory: $CONFIG_DIR"
    fi

    if [ ! -f "$POSTGRES_CONFIG" ]; then
        echo '{"databases":[],"users":[]}' > "$POSTGRES_CONFIG"
    fi

    if [ ! -f "$MYSQL_CONFIG" ]; then
        echo '{"databases":[],"users":[]}' > "$MYSQL_CONFIG"
    fi
}

save_database() {
    local db_type=$1
    local db_name=$2
    local owner=$3
    local config_file=""

    if [ "$db_type" == "postgres" ]; then
        config_file="$POSTGRES_CONFIG"
    else
        config_file="$MYSQL_CONFIG"
    fi

    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local temp_file=$(mktemp)

    jq --arg name "$db_name" --arg owner "$owner" --arg time "$timestamp" \
       '.databases += [{"name": $name, "owner": $owner, "created": $time}]' \
       "$config_file" > "$temp_file"

    mv "$temp_file" "$config_file"
}

save_user() {
    local db_type=$1
    local username=$2
    local password=$3
    local config_file=""

    if [ "$db_type" == "postgres" ]; then
        config_file="$POSTGRES_CONFIG"
    else
        config_file="$MYSQL_CONFIG"
    fi

    local timestamp=$(date +"%Y-%m-%d %H:%M:%S")
    local temp_file=$(mktemp)

    jq --arg user "$username" --arg pass "$password" --arg time "$timestamp" \
       '.users += [{"username": $user, "password": $pass, "created": $time, "databases": []}]' \
       "$config_file" > "$temp_file"

    mv "$temp_file" "$config_file"
}

link_user_to_database() {
    local db_type=$1
    local username=$2
    local db_name=$3
    local config_file=""

    if [ "$db_type" == "postgres" ]; then
        config_file="$POSTGRES_CONFIG"
    else
        config_file="$MYSQL_CONFIG"
    fi

    local temp_file=$(mktemp)

    jq --arg user "$username" --arg db "$db_name" \
       '(.users[] | select(.username == $user) | .databases) |= (. + [$db] | unique)' \
       "$config_file" > "$temp_file"

    mv "$temp_file" "$config_file"
}

remove_database_from_config() {
    local db_type=$1
    local db_name=$2
    local config_file=""

    if [ "$db_type" == "postgres" ]; then
        config_file="$POSTGRES_CONFIG"
    else
        config_file="$MYSQL_CONFIG"
    fi

    local temp_file=$(mktemp)

    jq --arg name "$db_name" \
       'del(.databases[] | select(.name == $name)) |
        (.users[].databases) |= (. - [$name])' \
       "$config_file" > "$temp_file"

    mv "$temp_file" "$config_file"
}

remove_user_from_config() {
    local db_type=$1
    local username=$2
    local config_file=""

    if [ "$db_type" == "postgres" ]; then
        config_file="$POSTGRES_CONFIG"
    else
        config_file="$MYSQL_CONFIG"
    fi

    local temp_file=$(mktemp)

    jq --arg user "$username" \
       'del(.users[] | select(.username == $user))' \
       "$config_file" > "$temp_file"

    mv "$temp_file" "$config_file"
}

update_user_password_in_config() {
    local db_type=$1
    local username=$2
    local new_password=$3
    local config_file=""

    if [ "$db_type" == "postgres" ]; then
        config_file="$POSTGRES_CONFIG"
    else
        config_file="$MYSQL_CONFIG"
    fi

    local temp_file=$(mktemp)

    jq --arg user "$username" --arg pass "$new_password" \
       '(.users[] | select(.username == $user) | .password) = $pass' \
       "$config_file" > "$temp_file"

    mv "$temp_file" "$config_file"
}

################################################################################
# Database Detection & Installation
################################################################################

check_postgres() {
    if command -v psql &> /dev/null; then
        return 0
    else
        return 1
    fi
}

check_mysql() {
    if command -v mysql &> /dev/null || [ -f /opt/lampp/bin/mysql ]; then
        return 0
    else
        return 1
    fi
}

get_mysql_cmd() {
    # Check if mysql is accessible via sudo (system installation)
    if sudo which mysql &> /dev/null; then
        echo "sudo mysql"
    # Check for XAMPP/LAMPP installation
    elif [ -f /opt/lampp/bin/mysql ]; then
        echo "/opt/lampp/bin/mysql -u root"
    # Fallback to regular mysql command
    elif command -v mysql &> /dev/null; then
        echo "mysql"
    else
        echo "mysql"
    fi
}

detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        echo "$ID"
    else
        echo "unknown"
    fi
}

install_postgres() {
    local os=$(detect_os)

    print_info "Installing PostgreSQL..."

    case $os in
        ubuntu|debian)
            sudo apt update
            sudo apt install -y postgresql postgresql-contrib
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        centos|rhel|fedora)
            sudo dnf install -y postgresql-server postgresql-contrib
            sudo postgresql-setup --initdb
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        arch|manjaro)
            sudo pacman -S --noconfirm postgresql
            sudo su - postgres -c "initdb -D /var/lib/postgres/data"
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
            ;;
        *)
            print_error "Unsupported OS. Please install PostgreSQL manually."
            return 1
            ;;
    esac

    print_success "PostgreSQL installed successfully!"
}

install_mysql() {
    local os=$(detect_os)

    print_info "Installing MySQL/MariaDB..."

    case $os in
        ubuntu|debian)
            sudo apt update
            sudo apt install -y mariadb-server mariadb-client
            sudo systemctl start mariadb
            sudo systemctl enable mariadb
            ;;
        centos|rhel|fedora)
            sudo dnf install -y mariadb-server mariadb
            sudo systemctl start mariadb
            sudo systemctl enable mariadb
            ;;
        arch|manjaro)
            sudo pacman -S --noconfirm mariadb
            sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
            sudo systemctl start mariadb
            sudo systemctl enable mariadb
            ;;
        *)
            print_error "Unsupported OS. Please install MySQL/MariaDB manually."
            return 1
            ;;
    esac

    print_success "MySQL/MariaDB installed successfully!"
}

################################################################################
# Sync/Import Functions
################################################################################

postgres_sync_existing() {
    print_header
    echo -e "${MAGENTA}=== Sync Existing PostgreSQL Databases & Users ===${NC}"
    echo -e "${CYAN}This will import existing databases and users into the config${NC}\n"

    print_warning "Note: Passwords cannot be retrieved from the database."
    print_info "You can update passwords later using 'Update User Password' option."
    echo ""
    read -p "Continue with sync? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Sync cancelled."
        pause
        return
    fi

    echo ""
    print_info "Scanning PostgreSQL for existing databases..."

    # Get all databases except system databases
    local databases=$(sudo -u postgres psql -t -c "SELECT datname FROM pg_database WHERE datistemplate = false AND datname NOT IN ('postgres');" 2>/dev/null | grep -v '^$' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    local db_count=0
    for db in $databases; do
        # Check if already in config
        local exists=$(jq --arg name "$db" '.databases[] | select(.name == $name)' "$POSTGRES_CONFIG")
        if [ -z "$exists" ]; then
            save_database "postgres" "$db" "postgres"
            print_success "Added database: $db"
            ((db_count++))
        fi
    done

    print_info "Scanning PostgreSQL for existing users..."

    # Get all users except system users
    local users=$(sudo -u postgres psql -t -c "SELECT usename FROM pg_user WHERE usename NOT IN ('postgres');" 2>/dev/null | grep -v '^$' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    local user_count=0
    for user in $users; do
        # Check if already in config
        local exists=$(jq --arg user "$user" '.users[] | select(.username == $user)' "$POSTGRES_CONFIG")
        if [ -z "$exists" ]; then
            save_user "postgres" "$user" "UNKNOWN_PASSWORD"
            print_success "Added user: $user (password: UNKNOWN_PASSWORD)"
            ((user_count++))
        fi
    done

    echo ""
    print_success "Sync complete!"
    print_info "Found $db_count new databases and $user_count new users"
    print_warning "Users with 'UNKNOWN_PASSWORD' should have their passwords updated."

    pause
}

mysql_sync_existing() {
    print_header
    echo -e "${MAGENTA}=== Sync Existing MySQL Databases & Users ===${NC}"
    echo -e "${CYAN}This will import existing databases and users into the config${NC}\n"

    print_warning "Note: Passwords cannot be retrieved from the database."
    print_info "You can update passwords later using 'Update User Password' option."
    echo ""
    read -p "Continue with sync? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Sync cancelled."
        pause
        return
    fi

    echo ""
    print_info "Scanning MySQL for existing databases..."

    # Get all databases except system databases
    local MYSQL_CMD=$(get_mysql_cmd)
    local databases=$($MYSQL_CMD -N -e "SHOW DATABASES;" 2>/dev/null | grep -vE '^(information_schema|performance_schema|mysql|sys)$')

    local db_count=0
    for db in $databases; do
        # Check if already in config
        local exists=$(jq --arg name "$db" '.databases[] | select(.name == $name)' "$MYSQL_CONFIG")
        if [ -z "$exists" ]; then
            save_database "mysql" "$db" "root"
            print_success "Added database: $db"
            ((db_count++))
        fi
    done

    print_info "Scanning MySQL for existing users..."

    # Get all users except system users
    local MYSQL_CMD=$(get_mysql_cmd)
    local users=$($MYSQL_CMD -N -e "SELECT DISTINCT User FROM mysql.user WHERE User NOT IN ('root', 'mysql.sys', 'mysql.session', 'mysql.infoschema', 'debian-sys-maint') AND User != '';" 2>/dev/null)

    local user_count=0
    for user in $users; do
        # Check if already in config
        local exists=$(jq --arg user "$user" '.users[] | select(.username == $user)' "$MYSQL_CONFIG")
        if [ -z "$exists" ]; then
            save_user "mysql" "$user" "UNKNOWN_PASSWORD"
            print_success "Added user: $user (password: UNKNOWN_PASSWORD)"
            ((user_count++))
        fi
    done

    echo ""
    print_success "Sync complete!"
    print_info "Found $db_count new databases and $user_count new users"
    print_warning "Users with 'UNKNOWN_PASSWORD' should have their passwords updated."

    pause
}

################################################################################
# Uninstall Functions
################################################################################

uninstall_postgres() {
    print_header
    echo -e "${MAGENTA}=== Uninstall PostgreSQL ===${NC}\n"

    print_warning "⚠⚠⚠ WARNING ⚠⚠⚠"
    echo -e "${RED}This will COMPLETELY remove PostgreSQL from your system!${NC}"
    echo -e "${RED}ALL databases and data will be PERMANENTLY DELETED!${NC}"
    echo ""

    # Show what will be deleted
    if [ -f "$POSTGRES_CONFIG" ]; then
        local db_count=$(jq '.databases | length' "$POSTGRES_CONFIG")
        local user_count=$(jq '.users | length' "$POSTGRES_CONFIG")
        echo -e "${YELLOW}Tracked data that will be lost:${NC}"
        echo -e "  • $db_count databases"
        echo -e "  • $user_count users"
        echo ""
    fi

    read -p "Type 'UNINSTALL POSTGRES' to confirm: " confirm

    if [ "$confirm" != "UNINSTALL POSTGRES" ]; then
        print_info "Uninstallation cancelled."
        pause
        return
    fi

    echo ""
    print_info "Stopping PostgreSQL service..."
    sudo systemctl stop postgresql 2>/dev/null

    print_info "Uninstalling PostgreSQL..."
    local os=$(detect_os)

    case $os in
        ubuntu|debian)
            sudo apt remove --purge -y postgresql postgresql-* 2>/dev/null
            sudo apt autoremove -y 2>/dev/null
            ;;
        centos|rhel|fedora)
            sudo dnf remove -y postgresql-server postgresql-contrib 2>/dev/null
            ;;
        arch|manjaro)
            sudo pacman -Rns --noconfirm postgresql 2>/dev/null
            ;;
        *)
            print_error "Unsupported OS for automatic uninstall."
            pause
            return
            ;;
    esac

    print_info "Removing data directories..."
    sudo rm -rf /var/lib/postgresql 2>/dev/null
    sudo rm -rf /etc/postgresql 2>/dev/null

    print_info "Clearing local config..."
    echo '{"databases":[],"users":[]}' > "$POSTGRES_CONFIG"

    print_success "PostgreSQL has been completely uninstalled!"

    pause
}

uninstall_mysql() {
    print_header
    echo -e "${MAGENTA}=== Uninstall MySQL/MariaDB ===${NC}\n"

    print_warning "⚠⚠⚠ WARNING ⚠⚠⚠"
    echo -e "${RED}This will COMPLETELY remove MySQL/MariaDB from your system!${NC}"
    echo -e "${RED}ALL databases and data will be PERMANENTLY DELETED!${NC}"
    echo ""

    # Show what will be deleted
    if [ -f "$MYSQL_CONFIG" ]; then
        local db_count=$(jq '.databases | length' "$MYSQL_CONFIG")
        local user_count=$(jq '.users | length' "$MYSQL_CONFIG")
        echo -e "${YELLOW}Tracked data that will be lost:${NC}"
        echo -e "  • $db_count databases"
        echo -e "  • $user_count users"
        echo ""
    fi

    read -p "Type 'UNINSTALL MYSQL' to confirm: " confirm

    if [ "$confirm" != "UNINSTALL MYSQL" ]; then
        print_info "Uninstallation cancelled."
        pause
        return
    fi

    echo ""
    print_info "Stopping MySQL/MariaDB service..."
    sudo systemctl stop mariadb 2>/dev/null
    sudo systemctl stop mysql 2>/dev/null

    print_info "Uninstalling MySQL/MariaDB..."
    local os=$(detect_os)

    case $os in
        ubuntu|debian)
            sudo apt remove --purge -y mariadb-server mariadb-client mysql-* 2>/dev/null
            sudo apt autoremove -y 2>/dev/null
            ;;
        centos|rhel|fedora)
            sudo dnf remove -y mariadb-server mariadb 2>/dev/null
            ;;
        arch|manjaro)
            sudo pacman -Rns --noconfirm mariadb 2>/dev/null
            ;;
        *)
            print_error "Unsupported OS for automatic uninstall."
            pause
            return
            ;;
    esac

    print_info "Removing data directories..."
    sudo rm -rf /var/lib/mysql 2>/dev/null
    sudo rm -rf /etc/mysql 2>/dev/null

    print_info "Clearing local config..."
    echo '{"databases":[],"users":[]}' > "$MYSQL_CONFIG"

    print_success "MySQL/MariaDB has been completely uninstalled!"

    pause
}

################################################################################
# PostgreSQL Functions
################################################################################

postgres_create_database() {
    print_header
    echo -e "${MAGENTA}=== Create PostgreSQL Database ===${NC}\n"

    local suggestion=$(generate_random_dbname)
    read -p "Enter database name [$suggestion]: " db_name
    db_name=${db_name:-$suggestion}

    if [ -z "$db_name" ]; then
        print_error "Database name cannot be empty!"
        pause
        return
    fi

    sudo -u postgres psql -c "CREATE DATABASE $db_name;" 2>/dev/null

    if [ $? -eq 0 ]; then
        save_database "postgres" "$db_name" "postgres"
        print_success "Database '$db_name' created successfully!"
    else
        print_error "Failed to create database. It may already exist."
    fi

    pause
}

postgres_create_user() {
    print_header
    echo -e "${MAGENTA}=== Create PostgreSQL User ===${NC}\n"

    local user_suggestion=$(generate_random_username)
    read -p "Enter username [$user_suggestion]: " username
    username=${username:-$user_suggestion}

    local pass_suggestion=$(generate_random_password)
    echo -e "${YELLOW}Suggested password: $pass_suggestion${NC}"
    read -sp "Enter password (or press Enter to use suggested): " password
    echo ""
    password=${password:-$pass_suggestion}

    if [ -z "$username" ] || [ -z "$password" ]; then
        print_error "Username and password cannot be empty!"
        pause
        return
    fi

    sudo -u postgres psql -c "CREATE USER $username WITH PASSWORD '$password';" 2>/dev/null

    if [ $? -eq 0 ]; then
        save_user "postgres" "$username" "$password"
        print_success "User '$username' created successfully!"
    else
        print_error "Failed to create user. It may already exist."
    fi

    pause
}

postgres_grant_access() {
    print_header
    echo -e "${MAGENTA}=== Grant PostgreSQL User Access ===${NC}\n"

    read -p "Enter username: " username
    read -p "Enter database name: " db_name

    if [ -z "$username" ] || [ -z "$db_name" ]; then
        print_error "Username and database name cannot be empty!"
        pause
        return
    fi

    print_info "Granting database privileges..."
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $username;" 2>/dev/null

    print_info "Granting schema privileges..."
    sudo -u postgres psql -d "$db_name" -c "GRANT ALL ON SCHEMA public TO $username;" 2>/dev/null
    sudo -u postgres psql -d "$db_name" -c "GRANT CREATE ON SCHEMA public TO $username;" 2>/dev/null
    sudo -u postgres psql -d "$db_name" -c "GRANT USAGE ON SCHEMA public TO $username;" 2>/dev/null

    print_info "Setting default privileges..."
    sudo -u postgres psql -d "$db_name" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $username;" 2>/dev/null
    sudo -u postgres psql -d "$db_name" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $username;" 2>/dev/null

    print_info "Transferring database ownership..."
    sudo -u postgres psql -c "ALTER DATABASE $db_name OWNER TO $username;" 2>/dev/null

    if [ $? -eq 0 ]; then
        link_user_to_database "postgres" "$username" "$db_name"
        print_success "Full access granted to '$username' on database '$db_name'!"
        print_success "User '$username' is now the owner of database '$db_name'"
    else
        print_warning "Some permissions may not have been granted, but basic access should work."
        link_user_to_database "postgres" "$username" "$db_name"
    fi

    pause
}

postgres_revoke_access() {
    print_header
    echo -e "${MAGENTA}=== Revoke PostgreSQL User Access ===${NC}\n"

    read -p "Enter username: " username
    read -p "Enter database name: " db_name

    if [ -z "$username" ] || [ -z "$db_name" ]; then
        print_error "Username and database name cannot be empty!"
        pause
        return
    fi

    sudo -u postgres psql -c "REVOKE ALL PRIVILEGES ON DATABASE $db_name FROM $username;" 2>/dev/null

    if [ $? -eq 0 ]; then
        # Remove from config
        local temp_file=$(mktemp)
        jq --arg user "$username" --arg db "$db_name" \
           '(.users[] | select(.username == $user) | .databases) |= (. - [$db])' \
           "$POSTGRES_CONFIG" > "$temp_file"
        mv "$temp_file" "$POSTGRES_CONFIG"

        print_success "Access revoked from '$username' on database '$db_name'!"
    else
        print_error "Failed to revoke access."
    fi

    pause
}

postgres_delete_database() {
    print_header
    echo -e "${MAGENTA}=== Delete PostgreSQL Database ===${NC}\n"

    read -p "Enter database name to delete: " db_name

    if [ -z "$db_name" ]; then
        print_error "Database name cannot be empty!"
        pause
        return
    fi

    print_warning "This will permanently delete the database '$db_name'!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Deletion cancelled."
        pause
        return
    fi

    sudo -u postgres psql -c "DROP DATABASE IF EXISTS $db_name;" 2>/dev/null

    if [ $? -eq 0 ]; then
        remove_database_from_config "postgres" "$db_name"
        print_success "Database '$db_name' deleted successfully!"
    else
        print_error "Failed to delete database."
    fi

    pause
}

postgres_delete_user() {
    print_header
    echo -e "${MAGENTA}=== Delete PostgreSQL User ===${NC}\n"

    read -p "Enter username to delete: " username

    if [ -z "$username" ]; then
        print_error "Username cannot be empty!"
        pause
        return
    fi

    print_warning "This will permanently delete user '$username'!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Deletion cancelled."
        pause
        return
    fi

    sudo -u postgres psql -c "DROP USER IF EXISTS $username;" 2>/dev/null

    if [ $? -eq 0 ]; then
        remove_user_from_config "postgres" "$username"
        print_success "User '$username' deleted successfully!"
    else
        print_error "Failed to delete user."
    fi

    pause
}

postgres_update_password() {
    print_header
    echo -e "${MAGENTA}=== Update PostgreSQL User Password ===${NC}\n"

    read -p "Enter username: " username
    read -sp "Enter new password: " new_password
    echo ""

    if [ -z "$username" ] || [ -z "$new_password" ]; then
        print_error "Username and password cannot be empty!"
        pause
        return
    fi

    sudo -u postgres psql -c "ALTER USER $username WITH PASSWORD '$new_password';" 2>/dev/null

    if [ $? -eq 0 ]; then
        update_user_password_in_config "postgres" "$username" "$new_password"
        print_success "Password updated for user '$username'!"
    else
        print_error "Failed to update password."
    fi

    pause
}

postgres_list_databases() {
    print_header
    echo -e "${MAGENTA}=== PostgreSQL Databases ===${NC}\n"

    if [ -f "$POSTGRES_CONFIG" ]; then
        echo -e "${CYAN}Databases from config:${NC}"
        jq -r '.databases[] | "  • \(.name) (Owner: \(.owner), Created: \(.created))"' "$POSTGRES_CONFIG"
        echo ""
    fi

    echo -e "${CYAN}Databases from PostgreSQL server:${NC}"
    sudo -u postgres psql -c "\l" 2>/dev/null | grep -v "template" | tail -n +4 | head -n -2

    pause
}

postgres_list_users() {
    print_header
    echo -e "${MAGENTA}=== PostgreSQL Users ===${NC}\n"

    if [ -f "$POSTGRES_CONFIG" ]; then
        echo -e "${CYAN}Users from config:${NC}\n"

        local users=$(jq -r '.users[] | @base64' "$POSTGRES_CONFIG")

        for user in $users; do
            local username=$(echo "$user" | base64 --decode | jq -r '.username')
            local password=$(echo "$user" | base64 --decode | jq -r '.password')
            local created=$(echo "$user" | base64 --decode | jq -r '.created')
            local databases=$(echo "$user" | base64 --decode | jq -r '.databases | join(", ")')

            echo -e "${GREEN}Username:${NC} $username"
            echo -e "${GREEN}Password:${NC} $password"
            echo -e "${GREEN}Created:${NC} $created"
            echo -e "${GREEN}Databases:${NC} ${databases:-None}"
            echo "---"
        done
        echo ""
    fi

    echo -e "${CYAN}Users from PostgreSQL server:${NC}"
    sudo -u postgres psql -c "\du" 2>/dev/null

    pause
}

postgres_view_connections() {
    print_header
    echo -e "${MAGENTA}=== PostgreSQL Database-User Connections ===${NC}\n"

    if [ -f "$POSTGRES_CONFIG" ]; then
        local users=$(jq -r '.users[] | @base64' "$POSTGRES_CONFIG")

        echo -e "${CYAN}User → Database Mapping:${NC}\n"

        for user in $users; do
            local username=$(echo "$user" | base64 --decode | jq -r '.username')
            local databases=$(echo "$user" | base64 --decode | jq -r '.databases | join(", ")')

            echo -e "${GREEN}$username${NC} → ${YELLOW}${databases:-No databases}${NC}"
        done
    else
        print_warning "No connection data available."
    fi

    pause
}

postgres_wizard() {
    print_header
    echo -e "${MAGENTA}=== PostgreSQL Database Wizard ===${NC}"
    echo -e "${CYAN}Quick setup: Create database + user + grant access${NC}\n"

    local db_suggestion=$(generate_random_dbname)
    read -p "Enter database name [$db_suggestion]: " db_name
    db_name=${db_name:-$db_suggestion}

    local user_suggestion=$(generate_random_username)
    read -p "Enter username [$user_suggestion]: " username
    username=${username:-$user_suggestion}

    local pass_suggestion=$(generate_random_password)
    echo -e "${YELLOW}Suggested password: $pass_suggestion${NC}"
    read -sp "Enter password (or press Enter to use suggested): " password
    echo ""
    password=${password:-$pass_suggestion}

    if [ -z "$db_name" ] || [ -z "$username" ] || [ -z "$password" ]; then
        print_error "All fields are required!"
        pause
        return
    fi

    echo ""
    print_info "Creating database '$db_name'..."
    sudo -u postgres psql -c "CREATE DATABASE $db_name;" 2>/dev/null
    if [ $? -eq 0 ]; then
        save_database "postgres" "$db_name" "$username"
        print_success "Database created!"
    else
        print_warning "Database may already exist, continuing..."
    fi

    print_info "Creating user '$username'..."
    sudo -u postgres psql -c "CREATE USER $username WITH PASSWORD '$password';" 2>/dev/null
    if [ $? -eq 0 ]; then
        save_user "postgres" "$username" "$password"
        print_success "User created!"
    else
        print_warning "User may already exist, continuing..."
    fi

    print_info "Granting database privileges..."
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $db_name TO $username;" 2>/dev/null

    print_info "Granting schema privileges (PostgreSQL 15+ compatibility)..."
    sudo -u postgres psql -d "$db_name" -c "GRANT ALL ON SCHEMA public TO $username;" 2>/dev/null
    sudo -u postgres psql -d "$db_name" -c "GRANT CREATE ON SCHEMA public TO $username;" 2>/dev/null
    sudo -u postgres psql -d "$db_name" -c "GRANT USAGE ON SCHEMA public TO $username;" 2>/dev/null

    print_info "Setting default privileges..."
    sudo -u postgres psql -d "$db_name" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $username;" 2>/dev/null
    sudo -u postgres psql -d "$db_name" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $username;" 2>/dev/null

    print_info "Transferring database ownership..."
    sudo -u postgres psql -c "ALTER DATABASE $db_name OWNER TO $username;" 2>/dev/null

    if [ $? -eq 0 ]; then
        link_user_to_database "postgres" "$username" "$db_name"
        print_success "Full privileges granted!"
    fi

    echo ""
    print_success "Setup complete!"
    print_info "Database is ready for Django/PostgreSQL 15+ applications"
    echo ""
    echo -e "${CYAN}Connection Details:${NC}"
    echo -e "${GREEN}Database:${NC} $db_name"
    echo -e "${GREEN}Username:${NC} $username"
    echo -e "${GREEN}Password:${NC} $password"
    echo -e "${GREEN}Host:${NC} localhost"
    echo -e "${GREEN}Port:${NC} 5432"
    echo -e "${GREEN}Connection String:${NC} postgresql://$username:$password@localhost/$db_name"
    echo ""
    echo -e "${YELLOW}For .env file:${NC}"
    echo -e "  DB_ENGINE=django.db.backends.postgresql"
    echo -e "  DB_NAME=$db_name"
    echo -e "  DB_USER=$username"
    echo -e "  DB_PASSWORD=$password"
    echo -e "  DB_HOST=localhost"
    echo -e "  DB_PORT=5432"

    pause
}

################################################################################
# MySQL/MariaDB Functions
################################################################################

mysql_create_database() {
    print_header
    echo -e "${MAGENTA}=== Create MySQL Database ===${NC}\n"

    local suggestion=$(generate_random_dbname)
    read -p "Enter database name [$suggestion]: " db_name
    db_name=${db_name:-$suggestion}

    if [ -z "$db_name" ]; then
        print_error "Database name cannot be empty!"
        pause
        return
    fi

    local MYSQL_CMD=$(get_mysql_cmd)
    $MYSQL_CMD -e "CREATE DATABASE \`$db_name\`;" 2>&1

    if [ $? -eq 0 ]; then
        save_database "mysql" "$db_name" "root"
        print_success "Database '$db_name' created successfully!"
    else
        print_error "Failed to create database. It may already exist."
    fi

    pause
}

mysql_create_user() {
    print_header
    echo -e "${MAGENTA}=== Create MySQL User ===${NC}\n"

    local user_suggestion=$(generate_random_username)
    read -p "Enter username [$user_suggestion]: " username
    username=${username:-$user_suggestion}

    local pass_suggestion=$(generate_random_password)
    echo -e "${YELLOW}Suggested password: $pass_suggestion${NC}"
    read -sp "Enter password (or press Enter to use suggested): " password
    echo ""
    password=${password:-$pass_suggestion}

    if [ -z "$username" ] || [ -z "$password" ]; then
        print_error "Username and password cannot be empty!"
        pause
        return
    fi

    $(get_mysql_cmd) -e "CREATE USER '$username'@'localhost' IDENTIFIED BY '$password';" 2>/dev/null

    if [ $? -eq 0 ]; then
        save_user "mysql" "$username" "$password"
        print_success "User '$username' created successfully!"
    else
        print_error "Failed to create user. It may already exist."
    fi

    pause
}

mysql_grant_access() {
    print_header
    echo -e "${MAGENTA}=== Grant MySQL User Access ===${NC}\n"

    read -p "Enter username: " username
    read -p "Enter database name: " db_name

    if [ -z "$username" ] || [ -z "$db_name" ]; then
        print_error "Username and database name cannot be empty!"
        pause
        return
    fi

    $(get_mysql_cmd) -e "GRANT ALL PRIVILEGES ON $db_name.* TO '$username'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null

    if [ $? -eq 0 ]; then
        link_user_to_database "mysql" "$username" "$db_name"
        print_success "Access granted to '$username' on database '$db_name'!"
    else
        print_error "Failed to grant access."
    fi

    pause
}

mysql_revoke_access() {
    print_header
    echo -e "${MAGENTA}=== Revoke MySQL User Access ===${NC}\n"

    read -p "Enter username: " username
    read -p "Enter database name: " db_name

    if [ -z "$username" ] || [ -z "$db_name" ]; then
        print_error "Username and database name cannot be empty!"
        pause
        return
    fi

    $(get_mysql_cmd) -e "REVOKE ALL PRIVILEGES ON $db_name.* FROM '$username'@'localhost'; FLUSH PRIVILEGES;" 2>/dev/null

    if [ $? -eq 0 ]; then
        # Remove from config
        local temp_file=$(mktemp)
        jq --arg user "$username" --arg db "$db_name" \
           '(.users[] | select(.username == $user) | .databases) |= (. - [$db])' \
           "$MYSQL_CONFIG" > "$temp_file"
        mv "$temp_file" "$MYSQL_CONFIG"

        print_success "Access revoked from '$username' on database '$db_name'!"
    else
        print_error "Failed to revoke access."
    fi

    pause
}

mysql_delete_database() {
    print_header
    echo -e "${MAGENTA}=== Delete MySQL Database ===${NC}\n"

    read -p "Enter database name to delete: " db_name

    if [ -z "$db_name" ]; then
        print_error "Database name cannot be empty!"
        pause
        return
    fi

    print_warning "This will permanently delete the database '$db_name'!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Deletion cancelled."
        pause
        return
    fi

    $(get_mysql_cmd) -e "DROP DATABASE IF EXISTS $db_name;" 2>/dev/null

    if [ $? -eq 0 ]; then
        remove_database_from_config "mysql" "$db_name"
        print_success "Database '$db_name' deleted successfully!"
    else
        print_error "Failed to delete database."
    fi

    pause
}

mysql_delete_user() {
    print_header
    echo -e "${MAGENTA}=== Delete MySQL User ===${NC}\n"

    read -p "Enter username to delete: " username

    if [ -z "$username" ]; then
        print_error "Username cannot be empty!"
        pause
        return
    fi

    print_warning "This will permanently delete user '$username'!"
    read -p "Are you sure? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        print_info "Deletion cancelled."
        pause
        return
    fi

    $(get_mysql_cmd) -e "DROP USER IF EXISTS '$username'@'localhost';" 2>/dev/null

    if [ $? -eq 0 ]; then
        remove_user_from_config "mysql" "$username"
        print_success "User '$username' deleted successfully!"
    else
        print_error "Failed to delete user."
    fi

    pause
}

mysql_update_password() {
    print_header
    echo -e "${MAGENTA}=== Update MySQL User Password ===${NC}\n"

    read -p "Enter username: " username
    read -sp "Enter new password: " new_password
    echo ""

    if [ -z "$username" ] || [ -z "$new_password" ]; then
        print_error "Username and password cannot be empty!"
        pause
        return
    fi

    $(get_mysql_cmd) -e "ALTER USER '$username'@'localhost' IDENTIFIED BY '$new_password';" 2>/dev/null

    if [ $? -eq 0 ]; then
        update_user_password_in_config "mysql" "$username" "$new_password"
        print_success "Password updated for user '$username'!"
    else
        print_error "Failed to update password."
    fi

    pause
}

mysql_list_databases() {
    print_header
    echo -e "${MAGENTA}=== MySQL Databases ===${NC}\n"

    if [ -f "$MYSQL_CONFIG" ]; then
        echo -e "${CYAN}Databases from config:${NC}"
        jq -r '.databases[] | "  • \(.name) (Owner: \(.owner), Created: \(.created))"' "$MYSQL_CONFIG"
        echo ""
    fi

    echo -e "${CYAN}Databases from MySQL server:${NC}"
    $(get_mysql_cmd) -e "SHOW DATABASES;" 2>/dev/null

    pause
}

mysql_list_users() {
    print_header
    echo -e "${MAGENTA}=== MySQL Users ===${NC}\n"

    if [ -f "$MYSQL_CONFIG" ]; then
        echo -e "${CYAN}Users from config:${NC}\n"

        local users=$(jq -r '.users[] | @base64' "$MYSQL_CONFIG")

        for user in $users; do
            local username=$(echo "$user" | base64 --decode | jq -r '.username')
            local password=$(echo "$user" | base64 --decode | jq -r '.password')
            local created=$(echo "$user" | base64 --decode | jq -r '.created')
            local databases=$(echo "$user" | base64 --decode | jq -r '.databases | join(", ")')

            echo -e "${GREEN}Username:${NC} $username"
            echo -e "${GREEN}Password:${NC} $password"
            echo -e "${GREEN}Created:${NC} $created"
            echo -e "${GREEN}Databases:${NC} ${databases:-None}"
            echo "---"
        done
        echo ""
    fi

    echo -e "${CYAN}Users from MySQL server:${NC}"
    $(get_mysql_cmd) -e "SELECT User, Host FROM mysql.user;" 2>/dev/null

    pause
}

mysql_view_connections() {
    print_header
    echo -e "${MAGENTA}=== MySQL Database-User Connections ===${NC}\n"

    if [ -f "$MYSQL_CONFIG" ]; then
        local users=$(jq -r '.users[] | @base64' "$MYSQL_CONFIG")

        echo -e "${CYAN}User → Database Mapping:${NC}\n"

        for user in $users; do
            local username=$(echo "$user" | base64 --decode | jq -r '.username')
            local databases=$(echo "$user" | base64 --decode | jq -r '.databases | join(", ")')

            echo -e "${GREEN}$username${NC} → ${YELLOW}${databases:-No databases}${NC}"
        done
    else
        print_warning "No connection data available."
    fi

    pause
}

mysql_wizard() {
    print_header
    echo -e "${MAGENTA}=== MySQL Database Wizard ===${NC}"
    echo -e "${CYAN}Quick setup: Create database + user + grant access${NC}\n"

    local db_suggestion=$(generate_random_dbname)
    read -p "Enter database name [$db_suggestion]: " db_name
    db_name=${db_name:-$db_suggestion}

    local user_suggestion=$(generate_random_username)
    read -p "Enter username [$user_suggestion]: " username
    username=${username:-$user_suggestion}

    local pass_suggestion=$(generate_random_password)
    echo -e "${YELLOW}Suggested password: $pass_suggestion${NC}"
    read -sp "Enter password (or press Enter to use suggested): " password
    echo ""
    password=${password:-$pass_suggestion}

    if [ -z "$db_name" ] || [ -z "$username" ] || [ -z "$password" ]; then
        print_error "All fields are required!"
        pause
        return
    fi

    local MYSQL_CMD=$(get_mysql_cmd)

    echo ""
    print_info "Creating database '$db_name'..."
    if $MYSQL_CMD -e "CREATE DATABASE \`$db_name\`;" 2>&1; then
        save_database "mysql" "$db_name" "$username"
        print_success "Database created!"
    else
        print_warning "Database may already exist, continuing..."
    fi

    print_info "Creating user '$username'..."
    # Escape the password properly by using MySQL's built-in escaping
    if $MYSQL_CMD -e "CREATE USER '$username'@'localhost' IDENTIFIED BY \"$password\";" 2>&1; then
        save_user "mysql" "$username" "$password"
        print_success "User created!"
    else
        print_warning "User may already exist, continuing..."
    fi

    print_info "Granting privileges..."
    if $MYSQL_CMD -e "GRANT ALL PRIVILEGES ON \`$db_name\`.* TO '$username'@'localhost'; FLUSH PRIVILEGES;" 2>&1; then
        link_user_to_database "mysql" "$username" "$db_name"
        print_success "Privileges granted!"
    else
        print_error "Failed to grant privileges."
    fi

    echo ""
    print_success "Setup complete!"
    echo ""
    echo -e "${CYAN}Connection Details:${NC}"
    echo -e "${GREEN}Database:${NC} $db_name"
    echo -e "${GREEN}Username:${NC} $username"
    echo -e "${GREEN}Password:${NC} $password"
    echo -e "${GREEN}Connection String:${NC} mysql://$username:$password@localhost/$db_name"

    pause
}

################################################################################
# Menu Functions
################################################################################

postgres_menu() {
    while true; do
        print_header
        echo -e "${MAGENTA}=== PostgreSQL Manager ===${NC}\n"
        echo -e "${CYAN}1.${NC} Database Wizard (Quick Setup)"
        echo -e "${CYAN}2.${NC} Sync Existing Databases & Users"
        echo -e "${CYAN}3.${NC} Create Database"
        echo -e "${CYAN}4.${NC} Create User"
        echo -e "${CYAN}5.${NC} Delete Database"
        echo -e "${CYAN}6.${NC} Delete User"
        echo -e "${CYAN}7.${NC} Update User Password"
        echo -e "${CYAN}8.${NC} View All Databases"
        echo -e "${CYAN}9.${NC} View All Users"
        echo -e "${CYAN}10.${NC} View Database-User Connections"
        echo -e "${CYAN}11.${NC} Grant User Access to Database"
        echo -e "${CYAN}12.${NC} Revoke User Access"
        echo -e "${CYAN}13.${NC} Back to Main Menu"
        echo ""
        read -p "Choose an option: " choice

        case $choice in
            1) postgres_wizard ;;
            2) postgres_sync_existing ;;
            3) postgres_create_database ;;
            4) postgres_create_user ;;
            5) postgres_delete_database ;;
            6) postgres_delete_user ;;
            7) postgres_update_password ;;
            8) postgres_list_databases ;;
            9) postgres_list_users ;;
            10) postgres_view_connections ;;
            11) postgres_grant_access ;;
            12) postgres_revoke_access ;;
            13) break ;;
            *) print_error "Invalid option!"; pause ;;
        esac
    done
}

mysql_menu() {
    while true; do
        print_header
        echo -e "${MAGENTA}=== MySQL/MariaDB Manager ===${NC}\n"
        echo -e "${CYAN}1.${NC} Database Wizard (Quick Setup)"
        echo -e "${CYAN}2.${NC} Sync Existing Databases & Users"
        echo -e "${CYAN}3.${NC} Create Database"
        echo -e "${CYAN}4.${NC} Create User"
        echo -e "${CYAN}5.${NC} Delete Database"
        echo -e "${CYAN}6.${NC} Delete User"
        echo -e "${CYAN}7.${NC} Update User Password"
        echo -e "${CYAN}8.${NC} View All Databases"
        echo -e "${CYAN}9.${NC} View All Users"
        echo -e "${CYAN}10.${NC} View Database-User Connections"
        echo -e "${CYAN}11.${NC} Grant User Access to Database"
        echo -e "${CYAN}12.${NC} Revoke User Access"
        echo -e "${CYAN}13.${NC} Back to Main Menu"
        echo ""
        read -p "Choose an option: " choice

        case $choice in
            1) mysql_wizard ;;
            2) mysql_sync_existing ;;
            3) mysql_create_database ;;
            4) mysql_create_user ;;
            5) mysql_delete_database ;;
            6) mysql_delete_user ;;
            7) mysql_update_password ;;
            8) mysql_list_databases ;;
            9) mysql_list_users ;;
            10) mysql_view_connections ;;
            11) mysql_grant_access ;;
            12) mysql_revoke_access ;;
            13) break ;;
            *) print_error "Invalid option!"; pause ;;
        esac
    done
}

view_all_data() {
    print_header
    echo -e "${MAGENTA}=== All Databases & Users (Across All Systems) ===${NC}\n"

    echo -e "${CYAN}╔════ PostgreSQL ════╗${NC}\n"

    if [ -f "$POSTGRES_CONFIG" ]; then
        echo -e "${YELLOW}Databases:${NC}"
        jq -r '.databases[] | "  • \(.name) (Owner: \(.owner))"' "$POSTGRES_CONFIG"
        echo ""

        echo -e "${YELLOW}Users:${NC}"
        jq -r '.users[] | "  • \(.username) - Password: \(.password)"' "$POSTGRES_CONFIG"
        echo ""
    else
        print_warning "No PostgreSQL data found."
        echo ""
    fi

    echo -e "${CYAN}╔════ MySQL/MariaDB ════╗${NC}\n"

    if [ -f "$MYSQL_CONFIG" ]; then
        echo -e "${YELLOW}Databases:${NC}"
        jq -r '.databases[] | "  • \(.name) (Owner: \(.owner))"' "$MYSQL_CONFIG"
        echo ""

        echo -e "${YELLOW}Users:${NC}"
        jq -r '.users[] | "  • \(.username) - Password: \(.password)"' "$MYSQL_CONFIG"
        echo ""
    else
        print_warning "No MySQL/MariaDB data found."
        echo ""
    fi

    pause
}

main_menu() {
    while true; do
        print_header
        echo -e "${MAGENTA}=== Main Menu ===${NC}\n"

        if check_postgres; then
            echo -e "${CYAN}1.${NC} PostgreSQL Manager ${GREEN}[Installed]${NC}"
        else
            echo -e "${CYAN}1.${NC} PostgreSQL Manager ${RED}[Not Installed]${NC}"
        fi

        if check_mysql; then
            echo -e "${CYAN}2.${NC} MySQL/MariaDB Manager ${GREEN}[Installed]${NC}"
        else
            echo -e "${CYAN}2.${NC} MySQL/MariaDB Manager ${RED}[Not Installed]${NC}"
        fi

        echo -e "${CYAN}3.${NC} View All Databases & Users"
        echo -e "${CYAN}4.${NC} Install PostgreSQL"
        echo -e "${CYAN}5.${NC} Install MySQL/MariaDB"
        echo -e "${CYAN}6.${NC} Uninstall PostgreSQL"
        echo -e "${CYAN}7.${NC} Uninstall MySQL/MariaDB"
        echo -e "${CYAN}8.${NC} Exit"
        echo ""
        read -p "Choose an option: " choice

        case $choice in
            1)
                if check_postgres; then
                    postgres_menu
                else
                    print_error "PostgreSQL is not installed!"
                    read -p "Do you want to install it now? (yes/no): " install_choice
                    if [ "$install_choice" == "yes" ]; then
                        install_postgres
                    fi
                    pause
                fi
                ;;
            2)
                if check_mysql; then
                    mysql_menu
                else
                    print_error "MySQL/MariaDB is not installed!"
                    read -p "Do you want to install it now? (yes/no): " install_choice
                    if [ "$install_choice" == "yes" ]; then
                        install_mysql
                    fi
                    pause
                fi
                ;;
            3) view_all_data ;;
            4) install_postgres; pause ;;
            5) install_mysql; pause ;;
            6)
                if check_postgres; then
                    uninstall_postgres
                else
                    print_error "PostgreSQL is not installed!"
                    pause
                fi
                ;;
            7)
                if check_mysql; then
                    uninstall_mysql
                else
                    print_error "MySQL/MariaDB is not installed!"
                    pause
                fi
                ;;
            8)
                print_success "Thank you for using Database Manager!"
                exit 0
                ;;
            *) print_error "Invalid option!"; pause ;;
        esac
    done
}

################################################################################
# Main Script
################################################################################

# Check for required tools
if ! command -v jq &> /dev/null; then
    print_error "jq is not installed. Installing..."
    sudo apt install -y jq 2>/dev/null || sudo dnf install -y jq 2>/dev/null || sudo pacman -S --noconfirm jq 2>/dev/null
fi

# Initialize configuration
init_config

# Start main menu
main_menu
