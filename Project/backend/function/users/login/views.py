# flake8: noqa
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone

from function.monitoring.middleware import api_user_agent
from .serializers import UserLoginSerializer
from function.serializer import UserDetailSerializer
from drf_yasg.utils import swagger_auto_schema
import function.util.swu as swu

@swagger_auto_schema(
    method="post",
    request_body=swu.request("password:string","email:string"),
    responses={201: swu.response("token:string","refresh:string","access:string")}
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Logs in the user into their account and returns a JWT token."""
    serializer = UserLoginSerializer(
        data=request.data, context={'request': request})

    is_serializer_valid = serializer.is_valid()
    if is_serializer_valid:
        user = serializer.validated_data['user']
        user.last_login = timezone.now()
        user.save()

        refresh = RefreshToken.for_user(user)
        user_serializer = UserDetailSerializer(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_serializer.data,
            'role_id': user.role.role_id,  # Get role_id directly from user
            "permissions": user.get_permissions() if hasattr(user, 'get_permissions') else []
        })

    return Response({
        'status': False,
        'message': 'Invalid credentials or user not found',
        },
        status=status.HTTP_400_BAD_REQUEST
    )


@swagger_auto_schema(
    method="post",
    request_body=swu.request("refresh:string"),
    responses={201: "Successfully logged out. Redirect to index page."}
)
@api_user_agent("User has attempted to logout.")
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logs out the user by blacklisting the refresh token."""
    try:
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        token.blacklist()

        return Response(
            {
                "status": True,
                "message": "Successfully logged out. Redirect to index page."
            },
            status=status.HTTP_205_RESET_CONTENT
        )
    except Exception as e:
        return Response(
            {
                "status": False,
                "message": "Failed to log out. Invalid token.",
                "error": str(e)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_user_agent("User has requested their profile information.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Returns the user profile information."""
    user = request.user
    serializer = UserDetailSerializer(user)
    response = serializer.data
    response["permissions"] = user.get_permissions() if hasattr(user, 'get_permissions') else []
    return Response(response)