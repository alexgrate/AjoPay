from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is a required field")
        
        email = self.normalize_email(email)
        extra_fields.setdefault("username", email.split("@")[0])
        extra_fields.setdefault("is_active", True)

        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if not extra_fields.get("is_staff"):
            raise ValueError("Superuser must have is_staff=True")
        if not extra_fields.get("is_superuser"):
            raise ValueError("Superuser must have is_superuser=True")

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
    email = models.EmailField(max_length=200, unique=True)
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100, blank=True)
    username = models.CharField(max_length=200, null=True, blank=True, unique=False)

    bank_name = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=10, blank=True)
    account_name = models.CharField(max_length=100, blank=True)

    trust_score = models.PositiveIntegerField(default=0)
    is_verified = models.BooleanField(default=False)
    is_premium = models.BooleanField(default=False)

    is_blacklisted = models.BooleanField(default=False)
    blacklist_reason = models.TextField(blank=True)
    default_count = models.PositiveIntegerField(default=0)

    bank_bonus_awarded  = models.BooleanField(default=False)    
    phone_bonus_awarded = models.BooleanField(default=False)

    paystack_customer_id = models.CharField(max_length=100, blank=True)
    paystack_authorization_code = models.CharField(max_length=100, blank=True)

    bvn = models.CharField(max_length=11, blank=True)
    bvn_verified = models.BooleanField(default=False)
    credit_score = models.PositiveIntegerField(null=True, blank=True)
    credit_risk_level = models.CharField(max_length=20, blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
