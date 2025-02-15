#!/bin/sh

# Wait for the database to be ready
while ! nc -z postgres-db 5432; do
  echo "Waiting for PostgreSQL..."
  sleep 1
done

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Start the Django server
exec python manage.py runserver 0.0.0.0:8000