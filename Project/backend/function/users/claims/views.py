from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from .serializers import ClaimCreationSerializer


@swagger_auto_schema(
    method='post',
    request_body=ClaimCreationSerializer,
    responses={201: "????"}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_claim(request):
    serializer = ClaimCreationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        result = serializer.save()
        return Response({
            'msg': 'Claim created successfully',
            **result
        }, status=status.HTTP_201_CREATED)
    return Response({
        'msg': 'Claim creation failed',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)