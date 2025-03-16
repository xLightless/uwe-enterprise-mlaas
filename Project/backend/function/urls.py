from django.urls import path, include
from function.users.registration.views import register_user, verify_otp
from function.users.login.views import login_user, get_user_profile
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
    # Include Djoser URLs
    path('auth/', include('djoser.urls')),
    # Swagger Docs
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui')
]
