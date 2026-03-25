from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

class Group(models.Model):

    STATUS_CHOICES = [
        ("pending",   "Pending"),
        ("active",    "Active"),
        ("completed", "Completed"),
        ("paused",    "Paused"),
    ]

    FREQUENCY_CHOICES = [
        ("daily",   "Daily"),
        ("weekly",  "Weekly"),
        ("monthly", "Monthly"),
    ]

    name        = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    creator     = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_groups"
    )

    contribution_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_members         = models.PositiveIntegerField()
    frequency           = models.CharField(max_length=20, choices=FREQUENCY_CHOICES, default="monthly")
    start_date          = models.DateField()
    status              = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    is_public           = models.BooleanField(default=False)
    invite_code         = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    current_cycle       = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def member_count(self):
        return self.memberships.count()

    @property
    def is_full(self):
        return self.member_count >= self.max_members

    @property
    def total_pool(self):
        return self.contribution_amount * self.max_members

    @property
    def active_member_count(self):
        return self.memberships.filter(is_suspended=False).count()


class Membership(models.Model):

    ROLE_CHOICES = [
        ("admin",  "Admin"),
        ("member", "Member"),
    ]

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="memberships"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="memberships"
    )

    role                = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")
    payout_order        = models.PositiveIntegerField(null=True, blank=True)
    joined_at           = models.DateTimeField(auto_now_add=True)
    has_received_payout = models.BooleanField(default=False)
    is_suspended        = models.BooleanField(default=False)

    class Meta:
        unique_together = ("group", "user")
        ordering        = ["payout_order", "joined_at"]

    def __str__(self):
        return f"{self.user.email} in {self.group.name}"

    @property
    def is_active_member(self):
        return not self.is_suspended


class JoinRequest(models.Model):

    STATUS_CHOICES = [
        ("pending",  "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    group      = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="join_requests")
    user       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="join_requests")
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    message    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("group", "user")
        ordering        = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} → {self.group.name} ({self.status})"


class Cycle(models.Model):

    STATUS_CHOICES = [
        ("pending",                "Pending"),
        ("collecting",             "Collecting"),
        ("contributions_complete", "Contributions Complete"),
        ("paid_out",               "Paid Out"),
    ]

    group         = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="cycles")
    cycle_number  = models.PositiveIntegerField()
    recipient     = models.ForeignKey(
        Membership,
        on_delete=models.SET_NULL,
        null=True,
        related_name="cycles_as_recipient"
    )
    due_date               = models.DateField()
    status                 = models.CharField(max_length=30, choices=STATUS_CHOICES, default="pending")
    payout_amount          = models.DecimalField(max_digits=12, decimal_places=2)
    payout_released_at     = models.DateTimeField(null=True, blank=True)
    released_by            = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name="released_payouts"
    )
    paystack_transfer_code = models.CharField(max_length=100, blank=True)
    created_at             = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("group", "cycle_number")
        ordering        = ["cycle_number"]

    def __str__(self):
        return f"{self.group.name} — Cycle {self.cycle_number}"

    @property
    def all_contributions_settled(self):
        return not self.contributions.filter(status="pending").exists()

    @property
    def blocking_members(self):
        return self.contributions.filter(status="pending").select_related("member__user")


class Contribution(models.Model):

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("paid", "Paid"),
        ("defaulted", "Defaulted"),
    ]

    cycle        = models.ForeignKey(Cycle, on_delete=models.CASCADE, related_name="contributions")
    member       = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name="contributions")
    amount       = models.DecimalField(max_digits=12, decimal_places=2)
    status       = models.CharField(max_length=25, choices=STATUS_CHOICES, default="pending")
    paid_at      = models.DateTimeField(null=True, blank=True)
    paystack_ref = models.CharField(max_length=100, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("cycle", "member")
        ordering        = ["created_at"]

    def __str__(self):
        return f"{self.member.user.email} — Cycle {self.cycle.cycle_number} ({self.status})"


class MemberDebt(models.Model):
    membership  = models.ForeignKey(
        Membership,
        on_delete=models.CASCADE,
        related_name="debts"
    )
    cycle       = models.ForeignKey(
        Cycle,
        on_delete=models.CASCADE,
        related_name="debts"
    )
    amount      = models.DecimalField(max_digits=12, decimal_places=2)
    reason      = models.CharField(max_length=200)
    is_cleared  = models.BooleanField(default=False)
    cleared_at  = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("membership", "cycle")
        ordering        = ["-created_at"]

    def __str__(self):
        return f"Debt — {self.membership.user.email} — Cycle {self.cycle.cycle_number} — ₦{self.amount}"