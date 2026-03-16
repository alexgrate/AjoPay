from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Group, Membership, JoinRequest

User = get_user_model()

class MemberSerializer(serializers.ModelSerializer):
    full_name  = serializers.SerializerMethodField()
    email      = serializers.EmailField(source="user.email", read_only=True)
    user_id    = serializers.IntegerField(source="user.id",  read_only=True)
    is_active  = serializers.BooleanField(source="is_active_member", read_only=True)

    class Meta:
        model  = Membership
        fields = (
            "id", "user_id", "full_name", "email", "role",
            "payout_order", "joined_at", "is_suspended", "is_active",
            "has_received_payout",
        )
        read_only_fields = ("id", "joined_at")

    def get_full_name(self, obj):
        return obj.user.full_name


class GroupSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()
    member_count = serializers.IntegerField(read_only=True)
    is_full      = serializers.BooleanField(read_only=True)
    total_pool   = serializers.DecimalField(
        max_digits=12, decimal_places=2, read_only=True
    )

    class Meta:
        model  = Group
        fields = (
            "id", "name", "description", "creator", "creator_name",
            "contribution_amount", "max_members", "frequency",
            "start_date", "status", "is_public", "invite_code",
            "member_count", "is_full", "total_pool", "created_at",
        )
        read_only_fields = ("id", "creator", "invite_code", "created_at")

    def get_creator_name(self, obj):
        return obj.creator.full_name


class GroupDetailSerializer(GroupSerializer):
    members = MemberSerializer(source="memberships", many=True, read_only=True)

    class Meta(GroupSerializer.Meta):
        fields = GroupSerializer.Meta.fields + ("members",)


class CreateGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Group
        fields = (
            "id", "name", "description", "contribution_amount",
            "max_members", "frequency", "start_date", "is_public",
        )

    def validate_max_members(self, value):
        if value < 2:
            raise serializers.ValidationError("A group must have at least 2 members")
        if value > 50:
            raise serializers.ValidationError("A group cannot have more than 50 members")
        return value

    def validate_contribution_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Contribution amount must be greater than 0")
        return value

    def create(self, validated_data):
        request = self.context.get("request")
        user = request.user

        if not user.bvn_verified:
            raise serializers.ValidationError(
                "Please verify you BVN before creating a group"
            )
        
        if user.credit_score is not None and user.credit_score < 40:
            raise serializers.ValidationError(
                "Your credit score is too low to create a group"
            )
        
        if validated_data.get("is_public") and user.credit_score < 60:
            raise serializers.ValidationError(
                "Your credit score must be 60 or above to create a public group"
            )
        
        group   = Group.objects.create(creator=user, **validated_data)
        Membership.objects.create(
            group        = group,
            user         = user,
            role         = "admin",
            payout_order = 1,
        )
        return group


class JoinRequestSerializer(serializers.ModelSerializer):
    full_name      = serializers.SerializerMethodField()
    email          = serializers.EmailField(source="user.email",         read_only=True)
    user_id        = serializers.IntegerField(source="user.id",          read_only=True)
    group_name     = serializers.CharField(source="group.name",          read_only=True)
    trust_score    = serializers.IntegerField(source="user.trust_score", read_only=True)
    default_count  = serializers.IntegerField(source="user.default_count", read_only=True)
    is_blacklisted = serializers.BooleanField(source="user.is_blacklisted", read_only=True)
    trust_warning  = serializers.SerializerMethodField()
    credit_score   = serializers.IntegerField(source="user.credit_score", read_only=True)
    credit_risk    = serializers.CharField(source="user.credit_risk_level", read_only=True)

    class Meta:
        model  = JoinRequest
        fields = (
            "id", "user_id", "full_name", "email", "group_name",
            "status", "message", "created_at",
            "trust_score", "default_count", "is_blacklisted",
            "trust_warning", "credit_score", "credit_risk",
        )
        read_only_fields = ("id", "status", "created_at")

    def get_full_name(self, obj):
        return obj.user.full_name

    def get_trust_warning(self, obj):
        user = obj.user
        if user.is_blacklisted:
            return "BLACKLISTED — do not accept"
        if user.default_count >= 2:
            return "HIGH RISK — multiple defaults"
        if user.credit_score and user.credit_score < 50:
            return "POOR CREDIT — high risk"
        if user.trust_score < 30:
            return "NEW USER — no track record yet"
        if user.trust_score < 50:
            return "CAUTION — building trust"
        return None