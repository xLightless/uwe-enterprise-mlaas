# flake8: noqa
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
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
    serializer = UserLoginSerializer(
        data=request.data, context={'request': request})
    if serializer.is_valid():
        user = serializer.validated_data['user']

        user.last_login = timezone.now()
        user.save()

        # Generate JWT token
        refresh = RefreshToken.for_user(user)

        # Get user details
        user_serializer = UserDetailSerializer(user)

        # Include role_id in the response
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': user_serializer.data,
            'role_id': serializer.validated_data['role_id'],
            "permissions": user.get_permissions()
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@swagger_auto_schema(
    method="post",
    request_body=swu.request("refresh:string"),
    responses={201: "Successfully logged out. Redirect to index page."}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    try:
        # Get the refresh token from the request data
        refresh_token = request.data.get("refresh")
        token = RefreshToken(refresh_token)
        
        # Blacklist the refresh token 
        token.blacklist()

        return Response(
            {"message": "Successfully logged out. Redirect to index page."},
            status=status.HTTP_205_RESET_CONTENT
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    user = request.user
    serializer = UserDetailSerializer(user)
    response = serializer.data
    response["permissions"] = user.get_permissions()
    return Response(response)
