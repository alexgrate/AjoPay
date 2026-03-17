from django.utils import timezone
from django.db import models
from datetime import timedelta, date
from .models import Group, Membership, Cycle, Contribution, MemberDebt


def get_next_due_date(from_date, frequency):
    if frequency == "daily":
        return from_date + timedelta(days=1)
    elif frequency == "weekly":
        return from_date + timedelta(weeks=1)
    elif frequency == "monthly":
        month = from_date.month + 1
        year  = from_date.year
        if month > 12:
            month = 1
            year += 1
        day = min(from_date.day, [31,28,31,30,31,30,31,31,30,31,30,31][month-1])
        return date(year, month, day)
    return from_date + timedelta(days=30)


def create_cycle(group, cycle_number, due_date):
    recipient = Membership.objects.filter(
        group        = group,
        payout_order = cycle_number,
        is_suspended = False,
    ).first()

    if not recipient:
        already_received = Membership.objects.filter(
            group=group, has_received_payout=True
        ).values_list("id", flat=True)
        recipient = Membership.objects.filter(
            group=group, is_suspended=False,
        ).exclude(id__in=already_received).first()

    active_members = Membership.objects.filter(
        group=group, is_suspended=False,
    )

    cycle = Cycle.objects.create(
        group         = group,
        cycle_number  = cycle_number,
        recipient     = recipient,
        due_date      = due_date,
        status        = "collecting",
        payout_amount = group.contribution_amount * active_members.count(),
    )

    Contribution.objects.bulk_create([
        Contribution(
            cycle  = cycle,
            member = member,
            amount = group.contribution_amount,
            status = "pending",
        )
        for member in active_members
    ])

    suspended_members = Membership.objects.filter(
        group=group, is_suspended=True,
    )
    MemberDebt.objects.bulk_create([
        MemberDebt(
            membership = member,
            cycle      = cycle,
            amount     = group.contribution_amount,
            reason     = f"Missed contribution — suspended — Cycle {cycle_number}",
        )
        for member in suspended_members
    ])

    group.current_cycle = cycle_number
    group.save(update_fields=["current_cycle"])

    return cycle


def handle_defaulters(cycle):
    pending_contributions = Contribution.objects.filter(
        cycle=cycle, status="pending",
    ).select_related("member__user")

    defaulted = []

    for contribution in pending_contributions:
        member = contribution.member
        user   = member.user

        if user.default_count == 0:
            contribution.status  = "defaulted"
            contribution.paid_at = timezone.now()
            contribution.save()

            member.is_suspended = True
            member.save(update_fields=["is_suspended"])

            user.default_count += 1
            user.trust_score    = max(0, user.trust_score - 20)
            user.save(update_fields=["default_count", "trust_score"])

            defaulted.append({
                "user":        user.full_name,
                "email":       user.email,
                "action":      "suspended",
                "trust_score": user.trust_score,
                "debt_owed":   float(_get_total_debt(member)),
            })

        else:
            contribution.status = "defaulted"
            contribution.save()

            user.default_count   += 1
            user.trust_score      = 0
            user.is_blacklisted   = True
            user.blacklist_reason = (
                f"Multiple defaults. Last on cycle "
                f"{cycle.cycle_number} in '{cycle.group.name}'."
            )
            user.save(update_fields=[
                "default_count", "trust_score",
                "is_blacklisted", "blacklist_reason"
            ])

            member.is_suspended = True
            member.save(update_fields=["is_suspended"])

            defaulted.append({
                "user":        user.full_name,
                "email":       user.email,
                "action":      "blacklisted",
                "trust_score": 0,
                "debt_owed":   float(_get_total_debt(member)),
            })

    if cycle.all_contributions_settled:
        cycle.status = "contributions_complete"
        cycle.save(update_fields=["status"])

    return defaulted


def award_on_time_payment(contribution):
    user = contribution.member.user
    if date.today() <= contribution.cycle.due_date:
        user.trust_score = min(100, user.trust_score + 5)
        user.save(update_fields=["trust_score"])


def award_cycle_completion(group, cycle):
    paid_on_time = Contribution.objects.filter(
        cycle=cycle, status="paid",
    ).select_related("member__user")

    for contribution in paid_on_time:
        user = contribution.member.user
        user.trust_score = min(100, user.trust_score + 10)
        user.save(update_fields=["trust_score"])


def award_profile_completion(user):
    changed = False
    if (user.account_number and user.bank_name and
            user.account_name and not user.bank_bonus_awarded):
        user.trust_score        = min(100, user.trust_score + 10)
        user.bank_bonus_awarded = True
        changed = True
    if user.phone and not user.phone_bonus_awarded:
        user.trust_score         = min(100, user.trust_score + 5)
        user.phone_bonus_awarded = True
        changed = True
    if changed:
        user.save(update_fields=[
            "trust_score", "bank_bonus_awarded", "phone_bonus_awarded"
        ])


def release_payout(cycle, released_by):
    if cycle.status != "contributions_complete":
        blocking = cycle.blocking_members
        names    = [c.member.user.full_name for c in blocking]
        return False, f"Cannot release — waiting on: {', '.join(names)}"

    if not cycle.recipient:
        return False, "No recipient set for this cycle"

    recipient_user = cycle.recipient.user

    if not recipient_user.account_number or not recipient_user.bank_name:
        return False, f"{recipient_user.full_name} has not added bank details yet"

    award_cycle_completion(cycle.group, cycle)

    import uuid
    transfer_code = f"MOCK_TRANSFER_{uuid.uuid4().hex[:10].upper()}"

    cycle.paystack_transfer_code = transfer_code
    cycle.released_by            = released_by
    cycle.status                 = "paid_out"
    cycle.payout_released_at     = timezone.now()
    cycle.save(update_fields=[
        "paystack_transfer_code", "released_by",
        "status", "payout_released_at"
    ])

    cycle.recipient.has_received_payout = True
    cycle.recipient.save(update_fields=["has_received_payout"])

    group        = cycle.group
    total_cycles = group.memberships.count()

    if cycle.cycle_number < total_cycles:
        next_number   = cycle.cycle_number + 1
        next_due_date = get_next_due_date(cycle.due_date, group.frequency)
        create_cycle(group, next_number, next_due_date)
    else:
        group.status = "completed"
        group.save(update_fields=["status"])

    return True, f"Payout of {cycle.payout_amount} initiated to {recipient_user.full_name}. Transfer: {transfer_code}"


def _get_total_debt(membership):
    result = MemberDebt.objects.filter(
        membership=membership, is_cleared=False,
    ).aggregate(total=models.Sum("amount"))
    return result["total"] or 0


def _get_bank_code(bank_name):
    BANK_CODES = {
        "Access Bank":            "044",
        "Citibank":               "023",
        "Diamond Bank":           "063",
        "Ecobank":                "050",
        "Fidelity Bank":          "070",
        "First Bank":             "011",
        "First City Monument":    "214",
        "Guaranty Trust Bank":    "058",
        "Heritage Bank":          "030",
        "Keystone Bank":          "082",
        "Polaris Bank":           "076",
        "Stanbic IBTC":           "221",
        "Standard Chartered":     "068",
        "Sterling Bank":          "232",
        "Union Bank":             "032",
        "United Bank for Africa": "033",
        "Unity Bank":             "215",
        "Wema Bank":              "035",
        "Zenith Bank":            "057",
        "Kuda Bank":              "50211",
        "Opay":                   "100004",
        "PalmPay":                "100033",
        "Moniepoint":             "50515",
    }
    return BANK_CODES.get(bank_name, "")