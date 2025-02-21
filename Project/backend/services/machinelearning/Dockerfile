FROM python:3.9

WORKDIR /app

COPY requirements.txt . 
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "your_ml_service_script.py"] # Replace your_ml_service_script.py
