FROM python:3.9

WORKDIR /app

# Copy the requirements file and install dependencies
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt
# Install PyTorch (CPU version)
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Copy the rest of the application files
COPY . /app

# Set the default command to run the app
CMD ["python", "app.py"]