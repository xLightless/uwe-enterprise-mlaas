# Dockerfile for django-app
FROM python:3.9

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

# Add this line to copy the entrypoint script
COPY django-web-app-entrypoint.sh .

RUN chmod +x django-web-app-entrypoint.sh

CMD ["./django-web-app-entrypoint.sh"]