from django.urls import path
from .machinelearning import app

urlpatterns = [
    path('predict/', app.predict, name='predict'),
]
