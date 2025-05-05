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
from services.views import predict
from function.users.perm_management.views import (
    create_permission,
    delete_permission,
    add_permission,
    remove_role_permission,
    view_all_role_permissions,
    view_permissions_by_role,
    get_database_permissions
)
from function.claims.user_views import create_claim, list_user_claims, get_claim_details, update_claim_status

from function.users.login.views import login_user, get_user_profile, \
    logout_user
from function.users.manage.views import get_user_details, \
    update_user_profile, list_all_users, get_user_by_id, admin_update_user, \
    delete_user, admin_create_user
from function.monitoring.views import (
    get_activity_logs_next,
    count_connections
)
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
    path('users/me/', get_user_details, name='get_user_details'),
    path('users/me/update/', update_user_profile, name='update_user_profile'),
    path('users/', list_all_users, name='list-users'),
    path('users/<int:user_id>/', get_user_by_id, name='get_user_by_id'),
    path('users/<int:user_id>/update/', admin_update_user,
         name='admin_update_user'),
    path('users/<int:user_id>/delete/', delete_user, name='delete_user'),

    # Admin - recovery and create accounts
    path('users/recovery/create-user/', admin_create_user, name='admin_create_user'),

    # Model management endpoints
    path('auth/add_models/', add_model, name='add_model'),
    path('models/<int:model_id>/delete/', delete_model, name='delete_model'),
    path('models/view/', view_models, name='view_models'),
    path('models/<int:model_id>/set_active/', set_active_model, name='set_active_model'),
    path('models/<int:pk>/', model_detail, name='model_detail'),
    path('models/<int:model_id>/statistics/', view_model_statistics, name='view_model_statistics'),
    path('models/<int:model_id>/feedback/', view_model_feedback, name='view_model_feedback'),
    
        # claim system endpoints
    path('claims/create/', create_claim, name='create_claim'),
    path('claims/', list_user_claims, name='list_user_claims'),
    path('claims/<int:claim_id>/', get_claim_details, name='get_claim_details'),
    path('claims/<int:claim_id>/update-status/', update_claim_status, name='update_claim_status'),


    #role management code
    path('roles/', view_roles, name='view_roles'),
    path('roles/<int:role_id>/', view_role_detail, name='view_role_detail'),
    path('roles/add/', add_role, name='add_role'),
    path('roles/update/<int:role_id>/', update_role, name='update_role'),
    path('roles/delete/<int:role_id>/', delete_role, name='delete_role'),


    path('predict/', predict, name='predict'),

    # role management endpoints
    path('permissions/create/', create_permission, name='create_permission'),
    path('permissions/delete/<int:permission_id>/', delete_permission, name='delete_permission'),
    path('permissions/roles/', view_all_role_permissions, name='view_all_role_permissions'),

    # Role permissions management endpoints
    path('permissions/', get_database_permissions, name='get_database_permissions'),
    path('permissions/role/<int:role_id>/', view_permissions_by_role, name='view_permissions_by_role'),
    path('permissions/role/<int:role_id>/update/', add_permission, name='add_permission'),
    path('permissions/role/<int:role_id>/delete/', remove_role_permission, name='delete_permission'),

    # Monitoring
    # path('logs/activity/', recent_activity_logs, name='recent-activity-logs'),
    path('logs/activity/<int:start_index>/<int:end_index>/', get_activity_logs_next, name='get_activity_logs_next'),
    path('logs/activity/chart/', count_connections, name='count_connections'),

    # Swagger Docs
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0),
        name='schema-swagger-ui')


]
