import json
from .models import ActivityLog


class ActivityLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        try:
            user = request.user if request.user.is_authenticated else None

            if user is None:
                return response

            device_info = json.dumps({
                'user_agent': request.META.get('HTTP_USER_AGENT', ''),
                'device': request.META.get('HTTP_SEC_CH_UA_PLATFORM', ''),
                'browser': request.META.get('HTTP_SEC_CH_UA', '')
            })

            ActivityLog.objects.using('traffic').create(
                user=user,
                ip_address=self.get_client_ip(request),
                description=f"{request.method} {request.path}",
                status_code=response.status_code,
                event_type=self.get_event_type(request, response),
                device_info=device_info
            )
        except Exception as e:
            # Honestly I don't know what errors may show up yet
            print(e)
            pass

        return response

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        return x_forwarded_for.split(',')[0] if x_forwarded_for \
            else request.META.get('REMOTE_ADDR')

    def get_event_type(self, request, response):
        if response.status_code >= 500:
            return "SERVER_ERROR"
        elif response.status_code >= 400:
            return "CLIENT_ERROR"
        elif "api" in request.path:
            return "API_REQUEST"
        return "PAGE_VIEW"