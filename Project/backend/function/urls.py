from django.urls import path, include
from function.users.registration.views import register_user, verify_otp
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
    # USER MANAGEMENT
    path('users/me/', get_user_details, name='user-details'),
    path('users/me/update/', update_user_profile, name='update-profile'),
    path('users/', list_all_users, name='list-users'),
    path('users/<int:user_id>/', get_user_by_id, name='user-by-id'),
    path('users/<int:user_id>/update/', admin_update_user,
         name='admin-update-user'),
    path('users/<int:user_id>/delete/', delete_user, name='delete-user'),
    # Monitoring
    path('logs/activity/', recent_activity_logs, name='recent-activity-logs'),
    # Include Djoser URLs
    path('auth/', include('djoser.urls')),
    # Swagger Docs
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0),
         name='schema-swagger-ui')
]
