from django.urls import path
from .views import (
    InitializeContributionView,
    VerifyPaymentView,
    PaystackWebhookView,
    RetryPayoutView,
    GetBanksView,
)

urlpatterns = [
    path("contribution/<int:contribution_id>/initialize/", InitializeContributionView.as_view(), name="initialize_contribution"),
    path("verify/<str:reference>/",                        VerifyPaymentView.as_view(),          name="verify_payment"),
    path("webhook/paystack/",                              PaystackWebhookView.as_view(),         name="paystack_webhook"),
    path("banks/",                                         GetBanksView.as_view(),                name="get_banks"),
    path("payout/<int:cycle_id>/retry/",                   RetryPayoutView.as_view(),             name="retry_payout"),
]