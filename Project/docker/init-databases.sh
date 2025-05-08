#!/bin/bash

set -e

# Function to create and initialize database
create_and_init_db() {
    database=$1
    echo "Checking/Creating database: $database"

    # Create database if it doesn't exist
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
        SELECT 'CREATE DATABASE $database'
        WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$database')\gexec
EOSQL

    # Initialize schema based on database name
        # "insurance_db")
        #     psql -U "$POSTGRES_USER" -d "$database" -f /docker-entrypoint-initdb.d/insurance.sql
        #     ;;
        # "ml_db")
        #     psql -U "$POSTGRES_USER" -d "$database" -f /docker-entrypoint-initdb.d/ml.sql
        #     ;;
        # "payments_db")
        #     psql -U "$POSTGRES_USER" -d "$database" -f /docker-entrypoint-initdb.d/payments.sql
        #     ;;
        # "traffic_db")
        #     psql -U "$POSTGRES_USER" -d "$database" -f /docker-entrypoint-initdb.d/traffic.sql
        #     ;;
        # "users_db")
        #     psql -U "$POSTGRES_USER" -d "$database" -f /docker-entrypoint-initdb.d/users.sql
        #     ;;
    case $database in
        "desd")
            psql -U "$POSTGRES_USER" -d "$database" -f /docker-entrypoint-initdb.d/desd.sql
            ;;
    esac
}

# Wait for PostgreSQL to be ready
until pg_isready; do
    echo "Waiting for PostgreSQL to be ready..."
    sleep 2
done

# Create and initialize each database
# create_and_init_db "insurance_db"
# create_and_init_db "ml_db"
# create_and_init_db "payments_db"
# create_and_init_db "traffic_db"
# create_and_init_db "users_db"
create_and_init_db "desd"

echo "Database initialization complete."