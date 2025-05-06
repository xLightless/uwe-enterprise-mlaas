FROM python:3.10-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set working directory
WORKDIR /app

# Install dependencies
COPY ./requirements.txt .
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Copy the project files
COPY . .
RUN pip install joblib
RUN pip install --no-cache-dir -r requirements.txt


# Make scripts executable
RUN chmod +x ./entrypoint.sh
RUN chmod +x ./wait-for

# Set the port
EXPOSE 8000

# Run entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Run init-database.py after entrypoint.sh completes (if it does)
# Modify the CMD section in your Dockerfile
