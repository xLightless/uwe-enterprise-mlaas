FROM python:3.9

WORKDIR /app

# Copy the requirements file and install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy the service files
COPY . /app

# Expose the port that matches your docker-compose configuration
EXPOSE 5000

# Set the default command to run the service
CMD ["python", "app.py"]