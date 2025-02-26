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

# Install dos2unix and convert line endings
RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix /app/entrypoint.sh && \
    dos2unix /app/wait-for && \
    chmod +x /app/entrypoint.sh && \
    chmod +x /app/wait-for && \
    apt-get --purge remove -y dos2unix && \
    rm -rf /var/lib/apt/lists/*

# Set the port
EXPOSE 8000

# Run entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]