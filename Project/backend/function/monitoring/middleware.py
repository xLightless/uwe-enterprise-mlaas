"""
Middleware for logging API requests with user agent and IP information.

Written by Reece Turner, 22036698.
"""

from functools import wraps
from django.utils import timezone
from user_agents import parse
from ..models import ActivityLog, Users
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.views import exception_handler
from django.http import JsonResponse
from django.http import HttpResponseBase
from rest_framework import status
import jwt


def api_user_agent(description=None):
    """
    Decorator to log API requests with user agent, IP, and activity log.

    :param description: Optional description for the activity log.
    """
    def decorator(func):
        @wraps(func)
        def wrapper(request, *args, **kwargs):
            try:
                auth = request.META.get('HTTP_AUTHORIZATION')
                if not auth:
                    return JsonResponse(
                        {
                            "status": False,
                            "message": "Authorization header missing."
                        },
                        status=401,
                    )

                token = auth.split(' ')[1]
                user_id = get_user_id(token)

                try:
                    user = Users.objects.get(user_id=user_id)
                except Users.DoesNotExist:
                    return JsonResponse(
                        {
                            "status": False,
                            "message": "User not found. Please login."
                        },
                        status=400,
                    )

                response = func(request, *args, **kwargs)
                if not isinstance(response, HttpResponseBase):
                    return JsonResponse(
                        {
                            "status": False,
                            "message": "Invalid response format."
                        },
                        status=500,
                    )

                ip_address = get_client_ip_address(request)
                device_info = get_device_info(request)
                status_code = getattr(response, 'status_code', 500)
                event_type = f"{request.method} {request.path}"

                # Save the activity log
                ActivityLog.objects.using('traffic_db').create(
                    user=user,
                    ip_address=ip_address,
                    description=description or "No description provided",
                    status_code=status_code,
                    event_type=event_type,
                    device_info=device_info,
                    generated_at=timezone.now()
                )

                return response

            except (IndexError, jwt.ExpiredSignatureError, jwt.DecodeError):
                return JsonResponse(
                    {
                        "status": False,
                        "message": "Invalid or expired token. Please login."
                    },
                    status=401,
                )

            except Exception as exc:
                return JsonResponse(
                    {
                        "status": False,
                        "message": "An unexpected error occurred.",
                        "data": str(exc),
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

        return wrapper
    return decorator


def get_client_ip_address(request):
    """
    Get the client's IP address from the request.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0]
    return request.META.get('REMOTE_ADDR')


def get_device_info(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    ua = parse(user_agent)
    return (
        f"{ua.device.family} / {ua.os.family} {ua.os.version_string} " +
        f"{ua.browser.family} {ua.browser.version_string}"
    )


def permission_denied(exc, context):
    """
    Handle cases where a user (session) is not authenticated.
    """
    response = exception_handler(exc, context)

    if response is not None and isinstance(exc, AuthenticationFailed):
        response.data = {
            "status": False,
            "message": str(exc.detail),
        }

    return response


def get_user_id(token):
    """Extract user ID from JWT token."""
    token = jwt.decode(token, options={"verify_signature": False})
    user_id = token['user_id']
    return user_id
