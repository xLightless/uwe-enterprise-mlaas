# flake8: noqa
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from function.monitoring.middleware import api_user_agent
from .ml_models import Model, UserModelFeedback
from .serializer import ModelSerializer, UserModelFeedbackSerializer


@api_user_agent("AI Engineer has added a new model.")
@api_view(['POST'])
@permission_classes([AllowAny])
def add_model(request):
    """
    Adds a new ML model to the system.
    """
    serializer = ModelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            "status": True,
            "message": "Model added successfully.",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        "status": False,
        "message": "Failed to add model.",
        "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_user_agent("AI Engineer has deleted a model.")
@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_model(request, model_id):
    """
    Delete a model by its ID.
    """
    model = get_object_or_404(Model, model_id=model_id)
    model.delete()
    return Response({
        "status": True,
        "message": f"Model with ID {model_id} deleted successfully.",
    }, status=status.HTTP_204_NO_CONTENT)


@api_user_agent("AI Engineer has viewed all models.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_models(request):
    """
    View all ML models in the system.
    """
    models = Model.objects.all()
    serializer = ModelSerializer(models, many=True)
    return Response({
        "status": True,
        "message": "Models retrieved successfully.",
        "data": serializer.data
    }, status=status.HTTP_200_OK)


@api_user_agent("AI Engineer has set a model as active.")
@api_view(['POST'])
@permission_classes([AllowAny])
def set_active_model(request, model_id):
    """
    Set a specific model as active.
    """
    Model.objects.update(is_active=False)
    model = get_object_or_404(Model, model_id=model_id)
    model.is_active = True
    model.save()
    return Response({
        "status": True,
        "message": f"Model with ID {model_id} set as active."
    }, status=status.HTTP_200_OK)


@api_user_agent("AI Engineer has viewed a model's details.")
@api_view(['GET'])
@permission_classes([AllowAny])
def model_detail(request, pk):
    """
    Retrieve, update or delete a model instance
    """
    model = get_object_or_404(Model, pk=pk)
    if request.method == 'GET':
        serializer = ModelSerializer(model)
        return Response({
            "status": True,
            "message": "Model details retrieved successfully.",
            "data": serializer.data}, status=status.HTTP_200_OK)
    elif request.method == 'PUT':
        serializer = ModelSerializer(model, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": True,
                "message": "Model updated successfully.",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({
            "status": False,
            "message": "Failed to update model.",
            "details": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        model.delete()
        return Response({
            "status": True,
            "message": f"Model with ID {pk} deleted successfully."
        }, status=status.HTTP_204_NO_CONTENT)


@api_user_agent("AI Engineer has viewed model statistics.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_model_statistics(request, model_id):
    """
    View statistics for a specific model.
    """
    model = get_object_or_404(Model, model_id=model_id)
    data = {
        'num_accepted_claims': model.num_accepted_claims,
        'num_rejected_claims': model.num_rejected_claims,
    }
    return Response({
        "status": True,
        "message": "Model statistics retrieved successfully.",
        "data": data}, status=status.HTTP_200_OK)


@api_user_agent("AI Engineer has viewed model feedback.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_model_feedback(request, model_id):
    """
    View feedback for a specific model.
    """
    feedbacks = UserModelFeedback.objects.filter(model_id=model_id)
    serializer = UserModelFeedbackSerializer(feedbacks, many=True)
    return Response({
        "status": True,
        "message": "Model feedback retrieved successfully.",
        "data": serializer.data}, status=status.HTTP_200_OK)
