import hashlib
import hmac
import json

from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from groups.models import Membership, Contribution, Cycle
from .models import PaymentReference
from .paystack import initialize_transaction, verify_transaction


class InitializeDepositView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, membership_id):
        membership = Membership.objects.filter(
            id=membership_id, user=request.user
        ).select_related("group", "user").first()

        if not membership:
            return Response(
                {"error": "Membership not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        if membership.deposit_paid:
            return Response(
                {"error": "Deposit already paid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        amount   = membership.group.contribution_amount
        callback = request.data.get("callback_url", "")

        pay_ref = PaymentReference.objects.create(
            user         = request.user,
            payment_type = "deposit",
            amount       = amount,
            membership   = membership,
        )

        result = initialize_transaction(
            email        = request.user.email,
            amount_naira = float(amount),
            reference    = str(pay_ref.reference),
            metadata     = {
                "payment_type":  "deposit",
                "membership_id": membership.id,
                "group_id":      membership.group.id,
                "group_name":    membership.group.name,
                "user_id":       request.user.id,
            },
            callback_url = callback,
        )

        if not result.get("status"):
            return Response(
                {"error": "Could not initialize payment", "detail": result},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response({
            "authorization_url": result["data"]["authorization_url"],
            "reference":         str(pay_ref.reference),
            "amount":            amount,
        })


class InitializeContributionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contribution_id):
        contribution = Contribution.objects.filter(
            id=contribution_id,
            member__user=request.user,
        ).select_related("cycle", "member__group", "member__user").first()

        if not contribution:
            return Response(
                {"error": "Contribution not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        if contribution.status == "paid":
            return Response(
                {"error": "Already paid"},
                status=status.HTTP_400_BAD_REQUEST
            )

        callback = request.data.get("callback_url", "")
        PLATFORM_FEE = 250

        pay_ref = PaymentReference.objects.create(
            user         = request.user,
            payment_type = "contribution",
            amount       = contribution.amount,
            membership   = contribution.member,
            contribution = contribution,
        )


        result = initialize_transaction(
            email        = request.user.email,
            amount_naira = float(contribution.amount) + PLATFORM_FEE,
            reference    = str(pay_ref.reference),
            metadata     = {
                "payment_type":    "contribution",
                "contribution_id": contribution.id,
                "cycle_id":        contribution.cycle.id,
                "cycle_number":    contribution.cycle.cycle_number,
                "group_id":        contribution.member.group.id,
                "group_name":      contribution.member.group.name,
                "user_id":         request.user.id,
            },
            callback_url = callback,
        )

        if not result.get("status"):
            return Response(
                {"error": "Could not initialize payment", "detail": result},
                status=status.HTTP_502_BAD_GATEWAY
            )

        return Response({
            "authorization_url": result["data"]["authorization_url"],
            "reference":         str(pay_ref.reference),
            "amount":            contribution.amount,
        })


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, reference):
        pay_ref = PaymentReference.objects.filter(
            reference=reference,
            user=request.user,
        ).first()

        if not pay_ref:
            return Response(
                {"error": "Reference not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        if pay_ref.status == "success":
            return Response({"message": "Already verified", "status": "success"})

        result = verify_transaction(str(pay_ref.reference))

        if not result.get("status") or result["data"]["status"] != "success":
            pay_ref.status = "failed"
            pay_ref.save()
            return Response(
                {"error": "Payment not successful", "detail": result},
                status=status.HTTP_400_BAD_REQUEST
            )

        pay_ref.status      = "success"
        pay_ref.paystack_ref = result["data"]["reference"]
        pay_ref.save()

        if pay_ref.payment_type == "deposit":
            _handle_deposit_success(pay_ref)
        elif pay_ref.payment_type == "contribution":
            _handle_contribution_success(pay_ref)

        return Response({"message": "Payment verified successfully", "status": "success"})


@method_decorator(csrf_exempt, name="dispatch")
class PaystackWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        paystack_sig = request.headers.get("x-paystack-signature", "")
        body         = request.body

        expected_sig = hmac.new(
            settings.PAYSTACK_SECRET_KEY.encode("utf-8"),
            body,
            hashlib.sha512,
        ).hexdigest()

        if paystack_sig != expected_sig:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        event      = json.loads(body)
        event_type = event.get("event")
        data       = event.get("data", {})

        if event_type == "charge.success":
            reference = data.get("metadata", {}).get("reference") or data.get("reference")
            pay_ref   = PaymentReference.objects.filter(reference=reference).first()

            if pay_ref and pay_ref.status != "success":
                pay_ref.status       = "success"
                pay_ref.paystack_ref = data.get("reference", "")
                pay_ref.save()

                if pay_ref.payment_type == "deposit":
                    _handle_deposit_success(pay_ref)
                elif pay_ref.payment_type == "contribution":
                    _handle_contribution_success(pay_ref)

        elif event_type == "transfer.success":
            _handle_transfer_success(data)

        elif event_type == "transfer.failed":
            _handle_transfer_failed(data)

        return Response(status=status.HTTP_200_OK)


def _handle_deposit_success(pay_ref):
    membership = pay_ref.membership
    if not membership:
        return

    membership.deposit_paid   = True
    membership.deposit_amount = pay_ref.amount
    membership.save()

    DepositTransaction.objects.update_or_create(
        membership = membership,
        defaults   = {
            "amount":      pay_ref.amount,
            "status":      "paid",
            "paystack_ref": pay_ref.paystack_ref,
            "paid_at":     timezone.now(),
        }
    )

def _handle_contribution_success(pay_ref):
    contribution = pay_ref.contribution
    if not contribution:
        return

    contribution.status       = "paid"
    contribution.paid_at      = timezone.now()
    contribution.paystack_ref = pay_ref.paystack_ref
    contribution.save()

    from groups.cycle_utils import award_on_time_payment
    award_on_time_payment(contribution)

    cycle = contribution.cycle
    if cycle.all_contributions_settled:
        cycle.status = "contributions_complete"
        cycle.save()

def _handle_transfer_success(data):
    transfer_code = data.get("transfer_code", "")
    
    cycle = Cycle.objects.filter(
        paystack_transfer_code=transfer_code
    ).first()

    if not cycle:
        return

    if cycle.status == "paid_out":
        return

    cycle.status             = "paid_out"
    cycle.payout_released_at = timezone.now()
    cycle.save(update_fields=["status", "payout_released_at"])

    if cycle.recipient:
        cycle.recipient.has_received_payout = True
        cycle.recipient.save(update_fields=["has_received_payout"])


def _handle_transfer_failed(data):
    transfer_code = data.get("transfer_code", "")

    cycle = Cycle.objects.filter(
        paystack_transfer_code=transfer_code
    ).first()

    if not cycle:
        return

    cycle.status = "contributions_complete"
    cycle.save(update_fields=["status"])

class GetBanksView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        from .paystack import get_banks
        result = get_banks()
        if not result.get("status"):
            return Response(
                {"error": "Could not fetch banks"},
                status=status.HTTP_502_BAD_GATEWAY
            )
        banks = [
            {
                "name": bank["name"],
                "code": bank["code"],
            }
            for bank in result.get("data", [])
        ]
        return Response({"banks": banks})


class RetryPayoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, cycle_id):
        from groups.models import Cycle, Membership
        from groups.cycle_utils import release_payout

        cycle = Cycle.objects.filter(pk=cycle_id).select_related(
            "group", "recipient__user"
        ).first()

        if not cycle:
            return Response(
                {"error": "Cycle not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        is_admin = Membership.objects.filter(
            group    = cycle.group,
            user     = request.user,
            role     = "admin",
        ).exists()

        if not is_admin:
            return Response(
                {"error": "Only admins can retry payouts"},
                status=status.HTTP_403_FORBIDDEN
            )

        if cycle.status != "contributions_complete":
            return Response(
                {"error": f"Cycle is {cycle.status} — cannot retry"},
                status=status.HTTP_400_BAD_REQUEST
            )

        success, message = release_payout(cycle, released_by=request.user)

        if not success:
            return Response(
                {"error": message},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({"message": message})
    

class ResolveAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        account_number = request.query_params.get("account_number", "")
        bank_code      = request.query_params.get("bank_code", "")

        if not account_number or not bank_code:
            return Response(
                {"error": "account_number and bank_code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(account_number) != 10:
            return Response(
                {"error": "Account number must be 10 digits"},
                status=status.HTTP_400_BAD_REQUEST
            )

        from .paystack import resolve_account
        result = resolve_account(account_number, bank_code)

        if not result.get("status"):
            return Response(
                {"error": "Could not verify account. Check account number and bank."},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            "account_name":   result["data"]["account_name"],
            "account_number": result["data"]["account_number"],
        })