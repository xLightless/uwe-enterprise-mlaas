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
COPY ./function/prediction/label_encoders.pkl ./function/prediction/label_encoders.pkl
COPY ./function/prediction/random_forest_model.pkl ./function/prediction/random_forest_model.pkl
COPY ./function/prediction/training_data.pkl ./function/prediction/training_data.pkl
RUN pip install lime
RUN pip install scikit-learn
RUN pip install google-genai
# Install PyTorch (CPU version)
RUN pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

# Make scripts executable
RUN chmod +x ./entrypoint.sh
RUN chmod +x ./wait-for

# Set the port
EXPOSE 8000

# Run entrypoint script
ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]

# Run init-database.py after entrypoint.sh completes (if it does)
# Modify the CMD section in your Dockerfile
