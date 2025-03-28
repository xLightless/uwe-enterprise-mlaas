from django.urls import path
from .app import predict

urlpatterns = [
    path('predict/', predict, name='predict'),
]
