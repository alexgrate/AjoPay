from django.contrib import admin
from .models import Group, Membership, JoinRequest, Cycle, Contribution, MemberDebt

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display   = ("name", "creator", "status", "frequency", "member_count", "max_members", "created_at")
    list_filter    = ("status", "frequency")
    search_fields  = ("name", "creator__email")
    readonly_fields = ("invite_code", "created_at", "updated_at")

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display  = ("user", "group", "role", "payout_order", "is_suspended", "has_received_payout", "joined_at")
    list_filter   = ("role", "is_suspended")
    search_fields = ("user__email", "group__name")

@admin.register(JoinRequest)
class JoinRequestAdmin(admin.ModelAdmin):
    list_display  = ("user", "group", "status", "created_at")
    list_filter   = ("status",)
    search_fields = ("user__email", "group__name")

@admin.register(Cycle)
class CycleAdmin(admin.ModelAdmin):
    list_display  = ("group", "cycle_number", "status", "recipient", "due_date", "payout_amount", "payout_released_at")
    list_filter   = ("status",)
    search_fields = ("group__name",)

@admin.register(Contribution)
class ContributionAdmin(admin.ModelAdmin):
    list_display  = ("member", "cycle", "amount", "status", "paid_at")
    list_filter   = ("status",)
    search_fields = ("member__user__email",)

@admin.register(MemberDebt)
class MemberDebtAdmin(admin.ModelAdmin):
    list_display  = ("membership", "cycle", "amount", "is_cleared", "created_at")
    list_filter   = ("is_cleared",)
    search_fields = ("membership__user__email",)