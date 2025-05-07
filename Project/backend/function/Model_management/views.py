# flake8: noqa
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from function.monitoring.middleware import api_user_agent
from function.models import Model, UserModelFeedback


@api_user_agent("AI Engineer has added a new model.")
@api_view(['POST'])
@permission_classes([AllowAny])
def add_model(request):
    """
    Adds a new ML model to the system.
    """
    try:
        # Create model directly from request data
        model = Model.objects.create(
            model_name=request.data.get('model_name'),
            model_description=request.data.get('model_description'),
            model_version=request.data.get('model_version'),
            uploaded_at=request.data.get('uploaded_at'),
            model_file=request.data.get('model_file'),
            label_encoder_file=request.data.get('label_encoder_file', '')
        )

        # Return model data as dictionary
        model_data = {
            'model_id': model.model_id,
            'model_name': model.model_name,
            'model_description': model.model_description,
            'model_version': str(model.model_version),
            'uploaded_at': model.uploaded_at,
            'is_active': model.is_active,
            'model_file': model.model_file,
            'label_encoder_file': model.label_encoder_file
        }

        return Response({
            "status": True,
            "message": "Model added successfully.",
            "data": model_data
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            "status": False,
            "message": "Failed to add model.",
            "details": str(e)
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
    model_list = []

    for model in models:
        model_list.append({
            'model_id': model.model_id,
            'model_name': model.model_name,
            'model_description': model.model_description,
            'model_version': str(model.model_version),
            'uploaded_at': model.uploaded_at,
            'is_active': model.is_active,
            'num_accepted_claims': model.num_accepted_claims,
            'num_rejected_claims': model.num_rejected_claims
        })

    return Response({
        "status": True,
        "message": "Models retrieved successfully.",
        "data": model_list
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
        model_data = {
            'model_id': model.model_id,
            'model_name': model.model_name,
            'model_description': model.model_description,
            'model_version': str(model.model_version),
            'uploaded_at': model.uploaded_at,
            'is_active': model.is_active,
            'model_file': model.model_file,
            'label_encoder_file': model.label_encoder_file
        }

        return Response({
            "status": True,
            "message": "Model details retrieved successfully.",
            "data": model_data
        }, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        try:
            model.model_name = request.data.get('model_name', model.model_name)
            model.model_description = request.data.get('model_description', model.model_description)
            model.model_version = request.data.get('model_version', model.model_version)
            model.model_file = request.data.get('model_file', model.model_file)
            model.label_encoder_file = request.data.get('label_encoder_file', model.label_encoder_file)
            model.save()

            model_data = {
                'model_id': model.model_id,
                'model_name': model.model_name,
                'model_description': model.model_description,
                'model_version': str(model.model_version),
                'uploaded_at': model.uploaded_at,
                'is_active': model.is_active,
                'model_file': model.model_file,
                'label_encoder_file': model.label_encoder_file
            }

            return Response({
                "status": True,
                "message": "Model updated successfully.",
                "data": model_data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "status": False,
                "message": "Failed to update model.",
                "details": str(e)
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
        "data": data
    }, status=status.HTTP_200_OK)


@api_user_agent("AI Engineer has viewed model feedback.")
@api_view(['GET'])
@permission_classes([AllowAny])
def view_model_feedback(request, model_id):
    """
    View feedback for a specific model.
    """
    feedbacks = UserModelFeedback.objects.filter(model_id=model_id)
    feedback_list = []

    for feedback in feedbacks:
        feedback_list.append({
            'feedback_id': feedback.feedback_id,
            'user_id': feedback.user.user_id,
            'settlement_amount': str(feedback.settlement_amount),
            'expected_amount': str(feedback.expected_amount),
            'feedback_rating': feedback.feedback_rating,
            'comments': feedback.comments
        })

    return Response({
        "status": True,
        "message": "Model feedback retrieved successfully.",
        "data": feedback_list
    }, status=status.HTTP_200_OK)
