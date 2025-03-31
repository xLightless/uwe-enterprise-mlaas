# flake8: noqa
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .ml_models import Model, UserModelFeedback
from .serializer import ModelSerializer, UserModelFeedbackSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def add_model(request):
    serializer = ModelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Model added successfully.", "data": serializer.data}, status=status.HTTP_201_CREATED)
    return Response({"error": "Failed to add model.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_model(request, model_id):
    model = get_object_or_404(Model, model_id=model_id)
    model.delete()
    return Response({"message": f"Model with ID {model_id} deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def view_models(request):
    models = Model.objects.all()
    serializer = ModelSerializer(models, many=True)
    return Response({"message": "Models retrieved successfully.", "data": serializer.data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def set_active_model(request, model_id):
    Model.objects.update(is_active=False)  
    model = get_object_or_404(Model, model_id=model_id)
    model.is_active = True  
    model.save()
    return Response({"message": f"Model with ID {model_id} set as active."}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def model_detail(request, pk):
    model = get_object_or_404(Model, pk=pk)
    if request.method == 'GET':
        serializer = ModelSerializer(model)
        return Response({"message": "Model details retrieved successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = ModelSerializer(model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Model updated successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update model.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        model.delete()
        return Response({"message": f"Model with ID {pk} deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([AllowAny])
def view_model_statistics(request, model_id):
    model = get_object_or_404(Model, model_id=model_id)
    data = {
        'num_accepted_claims': model.num_accepted_claims,
        'num_rejected_claims': model.num_rejected_claims,
    }
    return Response({"message": "Model statistics retrieved successfully.", "data": data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def view_model_feedback(request, model_id):
    feedbacks = UserModelFeedback.objects.filter(model_id=model_id)
    serializer = UserModelFeedbackSerializer(feedbacks, many=True)
    return Response({"message": "Model feedback retrieved successfully.", "data": serializer.data}, status=status.HTTP_200_OK)