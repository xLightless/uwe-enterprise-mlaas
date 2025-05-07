# flake8: noqa
from django.core.cache import cache
from django.conf import settings
from rest_framework.permissions import AllowAny
from twilio.rest import Client
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from function.monitoring.middleware import api_user_agent
from .serializers import UserCreateSerializer
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
import function.util.swu as swu
import function.util.debug as DEBUG


@swagger_auto_schema(
    method="post",
    request_body=swu.request(
        "password:string",
        "password2:string",
        "email:string",
        "full_name:string",
        "phone_number:string"
    ),
    responses={201: openapi.Response("Created (Check phone for verification)")}
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Registers a new user and sends an OTP to the
    provided phone number for verification.
    """

    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        phone_number = serializer.validated_data.get('phone_number')
        cache_key = f"user_data_{phone_number}"

        # Cache the validated user data for 5 minutes (300 seconds)
        cache.set(cache_key, serializer.validated_data, timeout=300)

        # Send SMS OTP using Twilio
        if not DEBUG.SKIP_TWILIO:
            client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            client.verify.services(
                settings.TWILIO_VERIFY_SERVICE_SID
            ).verifications.create(
                to=f"+44{phone_number}",
                channel='sms'
            )

        return Response({

            "message": "User data cached successfully. " +
                "Please check your phone for verification."
        }, status=status.HTTP_201_CREATED)

    errors = []
    for k, v in serializer.errors.items():
        errors.append(f"{k}: {v[0]}")
    return Response({
            'status': False,
            'message': errors,
        }, status=status.HTTP_400_BAD_REQUEST)

@swagger_auto_schema(
    method="post",
    request_body=swu.request(
        "otp:string",
        "password:string",
        "password2:string",
        "email:string",
        "full_name:string",
        "phone_number:string"
    ),
    responses={201: swu.response(
        "token:string",
        "refresh:string",
        "access:string",
        "user:object"
    )}
)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    phone_number = request.data.get('phone_number')
    email = request.data.get('email')
    otp = request.data.get('otp')

    # Validate input
    if not phone_number or not otp:
        return Response(
            {"error": "Phone number and OTP are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        if not DEBUG.SKIP_TWILIO:
            # Verify OTP using Twilio
            client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            verification_check = client.verify.services(
                settings.TWILIO_VERIFY_SERVICE_SID
            ).verification_checks.create(
                to=f"+44{phone_number}",
                code=otp # Ensure 'code' parameter is not None
            )

        if DEBUG.SKIP_TWILIO or verification_check.status == "approved":
            # Retrieve cached user data
            cache_key = f"user_data_{phone_number}"
            user_data = cache.get(cache_key)

            print("Verify OTP: ", user_data)

            if user_data:
                existing_user = Users.objects.filter(email=email).first()
                print("Existing user: ", existing_user)
                if existing_user:
                    return Response({
                        "status": False,
                        "message": "User already exists."
                    },
                    status=status.HTTP_400_BAD_REQUEST)

                serializer = UserCreateSerializer(data=user_data)
                if serializer.is_valid():
                    user = serializer.save()
                    user.is_verified = True
                    user.save()

                    print("Serialised is valid: ", user)

                    refresh = RefreshToken.for_user(user)

                    # Clear the cache
                    cache.delete(cache_key)

                    return Response({
                        "message": "User verified and registered successfully.",
                        "user": serializer.data,
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "permissions": user.get_permissions()
                    }, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "status": False,
                "message": "User data not found in cache."
            }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            "status": False,
            "message": "Invalid OTP."
        }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            "status": False,
            "message": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
