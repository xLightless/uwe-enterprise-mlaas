"""
function/urls.py
"""

# flake8: noqa
from django.urls import path, include
from function.users.registration.views import register_user, verify_otp
from function.users.login.views import login_user
from function.Model_management.views import (
    add_model, delete_model, view_models, set_active_model, model_detail,
    view_model_statistics, view_model_feedback
)

from function.users.role_management.views import (view_roles, view_role_detail,
                                            add_role, update_role, delete_role)
from function.prediction.views import predict
from function.users.perm_management.views import (
    create_permission, delete_permission, view_all_permissions, view_permissions_by_role)

from function.users.login.views import login_user, get_user_profile, \
    logout_user
from function.users.manage.views import get_user_details, \
    update_user_profile, list_all_users, get_user_by_id, admin_update_user, \
    delete_user
from function.monitoring.views import recent_activity_logs
from rest_framework_simplejwt.views import TokenRefreshView

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="API",
        default_version='v1',
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # Auth endpoints
    path('auth/register/', register_user, name='register'),
    path('auth/verify/', verify_otp, name='verify'),
    path('auth/login/', login_user, name='login'),
    path('auth/profile/', get_user_profile, name='profile'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout/', logout_user, name='logout'),

    # Include Djoser URLs
    path('auth/', include('djoser.urls')),

    # USER MANAGEMENT
    path('users/me/', get_user_details, name='user-details'),
    path('users/me/update/', update_user_profile, name='update-profile'),
    path('users/', list_all_users, name='list-users'),
    path('users/<int:user_id>/', get_user_by_id, name='user-by-id'),
    path('users/<int:user_id>/update/', admin_update_user,
         name='admin-update-user'),
    path('users/<int:user_id>/delete/', delete_user, name='delete-user'),

    # Model management endpoints
    path('auth/add_models/', add_model, name='add_model'),
    path('models/<int:model_id>/delete/', delete_model, name='delete_model'),
    path('models/view/', view_models, name='view_models'),
    path('models/<int:model_id>/set_active/', set_active_model, name='set_active_model'),
    path('models/<int:pk>/', model_detail, name='model_detail'),
    path('models/<int:model_id>/statistics/', view_model_statistics, name='view_model_statistics'),
    path('models/<int:model_id>/feedback/', view_model_feedback, name='view_model_feedback'),

    #role management code
    path('roles/', view_roles, name='view_roles'),
    path('roles/<int:role_id>/', view_role_detail, name='view_role_detail'),
    path('roles/add/', add_role, name='add_role'),
    path('roles/update/<int:role_id>/', update_role, name='update_role'),
    path('roles/delete/<int:role_id>/', delete_role, name='delete_role'),

    #prediction endpoint
    path('predict/', predict, name='predict'),

    # role management endpoints
    path('permissions/create/', create_permission, name='create_permission'),
    path('permissions/delete/<int:permission_id>/', delete_permission, name='delete_permission'),
    path('permissions/', view_all_permissions, name='view_all_permissions'),
    path('permissions/role/<int:role_id>/', view_permissions_by_role, name='view_permissions_by_role'),

    # Monitoring
    path('logs/activity/', recent_activity_logs, name='recent-activity-logs'),

    # Swagger Docs
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui')


]
