from rest_framework import serializers
from .models import *
from django.contrib.auth import get_user_model, authenticate
User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email").lower()
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError("Email and password are required")
        
        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")
        
        if not user.is_active:
            raise serializers.ValidationError("Your account has been disabled")
        
        data["user"] = user
        return data

class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'full_name', 'phone', 'password', 'confirm_password')
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        value = value.lower()
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered")
        return value
    
    def validate_phone(self, value):
        if not value:
            return value
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("This phone number is already registered")
        return value
    
    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        if len(data["password"]) < 8:
            raise serializers.ValidationError({"password": "Password must be at least 8 characters"})
        return data

    def create(self, validated_data):
        full_name = validated_data.pop("full_name")
        validated_data.pop("confirm_password")

        parts = full_name.strip().split(" ", 1)
        validated_data["first_name"] = parts[0]
        validated_data["last_name"] = parts[1] if len(parts) > 1 else ""

        user = User.objects.create_user(**validated_data)

        from groups.cycle_utils import award_profile_completion
        award_profile_completion(user)
        return user
    
class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    trust_tier = serializers.SerializerMethodField()

    class Meta:
        model  = User
        fields = (
            "id", "email", "full_name", "first_name", "last_name",
            "phone", "location", "bank_name", "account_number",
            "account_name", "trust_score", "trust_tier", "is_verified", "is_premium",
            "is_blacklisted", "default_count", "bvn_verified", "credit_score", "credit_risk_level",
            "date_joined",
        )
        read_only_fields = (
            "id", "trust_score", "trust_tier", "is_verified",
            "is_premium", "is_blacklisted", "default_count",
            "bvn_verified", "credit_score", "credit_risk_level",
        )

    def get_full_name(self, obj):
        return obj.full_name
    
    def get_trust_tier(self, obj):
        score = obj.trust_score
        if score <= 20:
            return {"label": "New Member",      "color": "#9e9e9e"}
        if score <= 50:
            return {"label": "Building Trust",  "color": "#d4a843"}
        if score <= 75:
            return {"label": "Trusted Member",  "color": "#1db893"}
        return     {"label": "Highly Trusted",  "color": "#7c5cbf"}
    
class UpdateProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = (
            "full_name", "first_name", "last_name", "phone", "location", "bank_name", "account_number", "account_name"
        )

    def validate_phone(self, value):
        if not value:
            return value
        qs = User.objects.filter(phone=value).exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This phone number is already in use")
        return value

    def validate_account_number(self, value):
        if value and len(value) != 10:
            raise serializers.ValidationError("Account number must be exactly 10 digits")
        return value
    
    def update(self, instance, validated_data):
        # If full_name was sent, split it into first/last
        full_name = validated_data.pop("full_name", None)
        if full_name:
            parts = full_name.strip().split(" ", 1)
            validated_data["first_name"] = parts[0]
            validated_data["last_name"]  = parts[1] if len(parts) > 1 else ""

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password     = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect")
        return value

    def validate(self, data):
        if data["new_password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        if data["new_password"] == data["current_password"]:
            raise serializers.ValidationError({"new_password": "New password must be different from current password"})
        return data

class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Incorrect password")
        return value