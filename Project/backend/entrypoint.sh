#!/bin/sh

echo "Waiting for Postgres Database Service to start..."
./wait-for "$DB_HOST":"$DB_PORT"

python manage.py makemigrations
python manage.py migrate

python manage.py runserver 0.0.0.0:8000