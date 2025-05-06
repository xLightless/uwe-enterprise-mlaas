from rest_framework.views import exception_handler
# from rest_framework.exceptions import PermissionDenied


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    try:
        response.data["status"] = False
        response.data["debug"] = "exception"
    except Exception as e:
        print("Couldn't append status: false", e)
    return response
