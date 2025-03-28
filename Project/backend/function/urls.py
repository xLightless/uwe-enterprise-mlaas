# flake8: noqa
# function/urls.py
from django.urls import path, include
from function.users.registration.views import register_user, verify_otp
from function.users.login.views import login_user
from function.Model_management.views import (
    add_model, delete_model, view_models, set_active_model, model_detail,
    view_model_statistics, view_model_feedback
)
#
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Auth endpoints
    path('auth/register/', register_user, name='register'),
    path('auth/verify/', verify_otp, name='verify'),
    path('auth/login/', login_user, name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Model management endpoints
    path('auth/add_models/', add_model, name='add_model'),
    path('models/<int:model_id>/delete/', delete_model, name='delete_model'),
    path('models/view/', view_models, name='view_models'),
    path('models/<int:model_id>/set_active/', set_active_model, name='set_active_model'),
    path('models/<int:pk>/', model_detail, name='model_detail'),
    path('models/<int:model_id>/statistics/', view_model_statistics, name='view_model_statistics'),
    path('models/<int:model_id>/feedback/', view_model_feedback, name='view_model_feedback'),
    
    # Admin management endpoints

    # Djoser authentication
    path('auth/', include('djoser.urls')),


]
