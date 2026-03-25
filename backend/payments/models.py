from django.db import models
from django.conf import settings
import uuid


class PaymentReference(models.Model):
    PAYMENT_TYPE_CHOICES = [
        ("contribution", "Cycle Contribution"),
    ]

    STATUS_CHOICES = [
        ("pending",  "Pending"),
        ("success",  "Success"),
        ("failed",   "Failed"),
    ]

    reference    = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    user         = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_references"
    )
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    amount       = models.DecimalField(max_digits=12, decimal_places=2)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")


    contribution = models.ForeignKey(
        "groups.Contribution",
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="payment_references"
    )

    paystack_ref = models.CharField(max_length=100, blank=True) 
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.payment_type} — {self.user.email} — {self.status}"