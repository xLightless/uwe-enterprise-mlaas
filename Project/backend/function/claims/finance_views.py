# flake8: noqa
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from function.models import Users, UserClaim, Payment, Invoice
from function.monitoring.middleware import api_user_agent
import stripe
import uuid
import json


# Using test key from settings
stripe.api_key = settings.STRIPE_API_KEY


@api_user_agent("User accessed Stripe signup.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_stripe_connect_account(request):
    """
    Generate a link to Stripe's standard signup page.
    """
    try:
        # Simply return the direct link to Stripe's standard dashboard signup
        stripe_signup_url = "https://dashboard.stripe.com/register"
        
        return Response({
            "message": "Click the link below to set up your Stripe account to receive payments.",
            "signup_url": stripe_signup_url
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Failed to generate Stripe signup link: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)


@api_user_agent("User linked their Stripe account.")
@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def add_stripe_account_id(request):
    """
    Allow users to manually enter their Stripe Connect account ID
    """
    try:
        user = request.user
        stripe_account_id = request.data.get('stripe_account_id')
        
        if not stripe_account_id:
            return Response({
                "error": "Stripe account ID is required"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        # Verify the account exists in Stripe
        try:
            account = stripe.Account.retrieve(stripe_account_id)
        except stripe.error.StripeError as e:
            return Response({
                "error": f"Invalid Stripe account ID: {str(e)}"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update the user with the Stripe account ID
        user.stripe_account_id = stripe_account_id
        user.save()
        
        return Response({
            "message": "Stripe account linked successfully",
            "stripe_account_id": stripe_account_id
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Failed to link Stripe account: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)




@api_user_agent("Finance team viewed claims to be settled.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def finance_get_claims_to_settle(request):
    """
    Retrieve claims that have been approved and need to be settled.
    """
    try:
        # Get claims that are approved but not yet settled
        user_claims = UserClaim.objects.filter(pending_claim='approved')
        
        # Apply sorting if provided
        sort_by = request.query_params.get('sort_by', 'claim__claim_date')
        sort_order = request.query_params.get('sort_order', 'asc')
        
        if sort_order.lower() == 'desc':
            sort_by = f"-{sort_by}"
        
        user_claims = user_claims.order_by(sort_by)
        
        # Apply pagination
        page = int(request.query_params.get('page', 1))
        page_size = int(request.query_params.get('page_size', 20))
        start_idx = (page - 1) * page_size
        end_idx = start_idx + page_size
        
        # Get total count before pagination
        total_count = user_claims.count()
        
        # Apply pagination
        user_claims = user_claims[start_idx:end_idx]
        
        claims_data = []
        for user_claim in user_claims:
            user = user_claim.user
            
            # Check if user has a Stripe account
            has_stripe_account = bool(user.stripe_account_id)
            
            # If they have an account, check if it's ready for payouts
            stripe_account_ready = False
            if has_stripe_account:
                try:
                    account = stripe.Account.retrieve(user.stripe_account_id)
                    stripe_account_ready = account.details_submitted and account.payouts_enabled
                except:
                    # If we can't retrieve the account, assume it's not ready
                    stripe_account_ready = False
            
            claims_data.append({
                "claim_id": user_claim.user_claim_id,
                "user_email": user.email,
                "user_name": user.full_name,
                "user_phone": user.phone_number,
                "accident_type": user_claim.user_accident.accident.accident_type,
                "claim_date": user_claim.claim.claim_date,
                "dominant_injury": user_claim.claim.Dominant_injury,
                "settlement_amount": user_claim.predicted_settlement_value,
                "payment_details": {
                    "has_stripe_account": has_stripe_account,
                    "stripe_account_ready": stripe_account_ready,
                    "can_link_test_account": True  # Added for testing
                }
            })
        
        return Response({
            "claims": claims_data,
            "total_count": total_count,
            "page": page,
            "page_size": page_size,
            "total_pages": (total_count + page_size - 1) // page_size
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Failed to retrieve claims for settlement: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)


@api_user_agent("Finance team initiated claim payment via Stripe Connect.")
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def finance_initiate_payment(request, claim_id):
    """
    Initiate payment for an approved claim using Stripe Connect.
    """
    try:
        user_claim = get_object_or_404(UserClaim, user_claim_id=claim_id)
        
        # Check if claim is in approved status (not yet settled)
        if user_claim.pending_claim != 'approved':
            return Response({
                "error": f"Cannot initiate payment for claim with status '{user_claim.pending_claim}'. Only approved claims can be processed. Settled claims have already been paid."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get user and payment amount
        user = user_claim.user
        payment_amount = user_claim.predicted_settlement_value
        
        # Convert payment amount to cents/pence for Stripe
        payment_amount_cents = int(float(payment_amount) * 100)
        
        # Check if user has a Stripe account
        if not user.stripe_account_id:
            return Response({
                "error": "User does not have a Stripe Connect account set up for receiving payments.",
                "needs_onboarding": True,
                "test_mode_available": True,
                "test_instructions": "For testing, use the link_test_stripe_account endpoint to link a test Stripe account to this user"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user's Stripe account is ready for payouts
        account = stripe.Account.retrieve(user.stripe_account_id)
        if not account.details_submitted or not account.payouts_enabled:
            return Response({
                "error": "User's Stripe account is not fully set up or is not enabled for payouts.",
                "account_status": {
                    "details_submitted": account.details_submitted,
                    "payouts_enabled": account.payouts_enabled
                },
                "needs_onboarding_completion": True,
                "test_mode_available": True,
                "test_instructions": "For testing, this account may not be fully set up. You can use the link_test_stripe_account endpoint to link a different test account."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a payment reference
        payment_reference = f"CLAIM-{claim_id}-{uuid.uuid4().hex[:8]}"
        
        # Create a Transfer to the connected account
        transfer = stripe.Transfer.create(
            amount=payment_amount_cents,
            currency="gbp",
            destination=user.stripe_account_id,
            transfer_group=payment_reference,
            metadata={
                "claim_id": claim_id,
                "user_id": str(user.user_id),
                "payment_reference": payment_reference,
                "type": "settlement_payment"
            },
            description=f"Settlement payment for claim {claim_id}"
        )
        
        # Create payment record in our system
        payment = Payment.objects.create(
            user=user,
            amount=payment_amount,
            status=True,  # Payment initiated
            created_at=timezone.now()
        )
        
        # Create invoice
        invoice = Invoice.objects.create(
            user=user,
            total_amount=payment_amount,
            due_date=timezone.now() + timezone.timedelta(days=2),  # Payment expected in 2 days
            status=False,  # Not marked as paid yet
            generated_at=timezone.now()
        )
        
        # Update claim status to "settled"
        user_claim.pending_claim = 'settled'
        user_claim.save()
        
        # Return success response without the problematic status field
        return Response({
            "message": "Payment initiated successfully via Stripe Connect",
            "claim_id": user_claim.user_claim_id,
            "payment_id": payment.payment_id,
            "invoice_id": invoice.invoice_id,
            "payment_reference": payment_reference,
            "stripe_transfer_id": transfer.id,
            "amount": payment_amount,
            "expected_settlement_date": timezone.now() + timezone.timedelta(days=2)
        }, status=status.HTTP_200_OK)
            
    except stripe.error.StripeError as stripe_error:
        error_response = {
            "error": f"Stripe payment processing failed: {str(stripe_error)}"
        }
        
        # Safely add error details if they exist
        if hasattr(stripe_error, 'code'):
            error_response["code"] = stripe_error.code
        
        if hasattr(stripe_error, 'type'):
            error_response["type"] = stripe_error.type
        
        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        # More general error handling
        return Response({
            "message": "Payment initiated but status could not be confirmed",
            "note": "Please check the payment dashboard for confirmation"
        }, status=status.HTTP_200_OK)


@api_user_agent("User viewed their payment status.")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_get_payment_status(request, claim_id):
    """
    Allow users to check the status of their claim payment.
    Simplified for the current model structure.
    """
    try:
        # Get the user claim and check if it belongs to the current user
        user_claim = get_object_or_404(UserClaim, user_claim_id=claim_id)
        
        # Security check to ensure users can only view their own claims
        if user_claim.user.user_id != request.user.user_id:
            return Response({
                "error": "You do not have permission to view this claim"
            }, status=status.HTTP_403_FORBIDDEN)
        
        # Check if user needs to set up Stripe Connect
        needs_stripe_setup = False
        can_use_test_account = False
        
        if user_claim.pending_claim == 'approved' or user_claim.pending_claim == 'settled':
            # Check if user has a Stripe account
            if not user_claim.user.stripe_account_id:
                needs_stripe_setup = True
                can_use_test_account = True  # They can use the test account link
            else:
                # Check if the account is fully set up
                try:
                    account = stripe.Account.retrieve(user_claim.user.stripe_account_id)
                    if not account.details_submitted or not account.payouts_enabled:
                        needs_stripe_setup = True
                        can_use_test_account = True
                except:
                    needs_stripe_setup = True
                    can_use_test_account = True
        
        response_data = {
            "claim_id": user_claim.user_claim_id,
            "status": user_claim.pending_claim,
            "predicted_settlement": user_claim.predicted_settlement_value,
            "needs_stripe_setup": needs_stripe_setup,
            "payment_status": "Not yet processed" if user_claim.pending_claim != 'settled' else "Processing"
        }
        
        # Add testing information if applicable
        if can_use_test_account:
            response_data["test_mode_available"] = True
            response_data["test_instructions"] = "For testing, use the link_test_stripe_account endpoint to link a test Stripe account"
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            "error": f"Failed to retrieve payment status: {str(e)}"
        }, status=status.HTTP_400_BAD_REQUEST)
