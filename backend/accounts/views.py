from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer, UpdateProfileSerializer, ChangePasswordSerializer, DeleteAccountSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import get_user_model


User = get_user_model()

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


class RegisterViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "message": "Registration successful",
                    "user": UserSerializer(user).data,
                    "tokens": tokens,
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class LoginViewset(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
            tokens = get_tokens_for_user(user)
            return Response(
                {
                    "message": "Login successful",
                    "user": UserSerializer(user).data,
                    "tokens": tokens,
                },
                status=status.HTTP_200_OK
            )
        errors = serializer.errors
        if "non_field_errors" in errors:
            return Response(
                {"error": errors["non_field_errors"][0]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutViewset(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logged out successfully"},
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
class ProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)
    
    def patch(self, request):
        serializer = UpdateProfileSerializer(
            request.user, 
            data=request.data,
            partial=True,
            context={"request": request}
        )
        if serializer.is_valid():
            user = serializer.save()

            from groups.cycle_utils import award_profile_completion
            award_profile_completion(user) 
            
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )
        if serializer.is_valid():
            request.user.set_password(serializer.validated_data["new_password"])
            request.user.save()

            tokens = get_tokens_for_user(request.user)
            return Response({
                "message": "Password updated successfully",
                "tokens": tokens,
            })
        
        errors = serializer.errors
        if "non_field_errors" in errors:
            return Response(
                {"error": errors["non_field_errors"][0]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteAccountView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        serializer = DeleteAccountSerializer(
            data=request.data,
            context={"request": request},
        )
        if serializer.is_valid():
            user = request.user
            try:
                refresh_token = request.data.get("refresh")
                if refresh_token:
                    token = RefreshToken(refresh_token)
                    token.blacklist()
            except Exception:
                pass
            user.delete()
            return Response({"message": "Account deleted successfully"}, status=status.HTTP_200_OK)
        
        errors = serializer.errors
        if "non_field_errors" in errors:
            return Response(
                {"error": errors["non_field_errors"][0]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    
class BVNVerificationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        bvn = request.data.get("bvn", "").strip()

        if not bvn:
            return Response(
                {"error": "BVN is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not bvn.isdigit() or len(bvn) != 11:
            return Response(
                {"error": "BVN must be exactly 11 digits"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if request.user.bvn_verified:
            return Response(
                {"error": "BVN already verified"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(bvn=bvn).exclude(pk=request.user.pk).exists():
            return Response(
                {"error": "This BVN is already linked to another account"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = _mock_verify_bvn(bvn, request.user)

        if not result["verified"]:
            return Response(
                {"error": result["message"]},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = request.user
        user.bvn               = bvn
        user.bvn_verified      = True
        user.credit_score      = result["credit_score"]
        user.credit_risk_level = result["risk_level"]
        user.save(update_fields=[
            "bvn", "bvn_verified",
            "credit_score", "credit_risk_level"
        ])

        return Response({
            "message":      "BVN verified successfully",
            "credit_score": result["credit_score"],
            "risk_level":   result["risk_level"],
            "access_level": result["access_level"],
            "user":         UserSerializer(user).data,
        })


class CreditScoreView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.bvn_verified:
            return Response({
                "bvn_verified":  False,
                "message":       "Please verify your BVN to get your credit score",
                "credit_score":  None,
                "risk_level":    None,
                "access_level":  None,
            })

        return Response({
            "bvn_verified":  True,
            "credit_score":  user.credit_score,
            "risk_level":    user.credit_risk_level,
            "access_level":  _get_access_level(user.credit_score),
            "can_join_public_groups":  user.credit_score >= 60,
            "can_join_private_groups": user.credit_score >= 40,
            "trust_score":   user.trust_score,
            "trust_tier":    UserSerializer(user).data["trust_tier"],
        })
    

def _mock_verify_bvn(bvn, user):
    import time
    time.sleep(1.5)

    first_digit = bvn[0]

    if first_digit == "1":
        # Poor — limited access
        import hashlib
        h = int(hashlib.md5(bvn.encode()).hexdigest(), 16)
        credit_score = (h % 20) + 40  # 40-59
    elif first_digit == "2":
        # Fair
        import hashlib
        h = int(hashlib.md5(bvn.encode()).hexdigest(), 16)
        credit_score = (h % 15) + 50  # 50-64
    elif first_digit == "3":
        # Good
        import hashlib
        h = int(hashlib.md5(bvn.encode()).hexdigest(), 16)
        credit_score = (h % 15) + 65  # 65-79
    elif first_digit == "4":
        # Excellent
        import hashlib
        h = int(hashlib.md5(bvn.encode()).hexdigest(), 16)
        credit_score = (h % 20) + 80  # 80-100
    else:
        # Default — good range
        import hashlib
        h = int(hashlib.md5(bvn.encode()).hexdigest(), 16)
        credit_score = (h % 20) + 60  # 60-79

    risk_level   = _get_risk_level(credit_score)
    access_level = _get_access_level(credit_score)

    return {
        "verified":      True,
        "credit_score":  credit_score,
        "risk_level":    risk_level,
        "access_level":  access_level,
        "message":       "BVN verified successfully",
    }

def _get_risk_level(score):
    if score >= 80:
        return "excellent"
    if score >= 60:
        return "good"
    if score >= 50:
        return "fair"
    return "poor"


def _get_access_level(score):
    if score >= 80:
        return {
            "label":               "Full Access",
            "can_join_public":     True,
            "can_join_private":    True,
            "can_create_public": True,
            "can_create_private": True,
            "description":         "You can join and create any group",
        }
    if score >= 60:
        return {
            "label":               "Standard Access",
            "can_join_public":     True,
            "can_join_private":    True,
            "can_create_public": True,
            "can_create_private": True,
            "description":         "You can join and create public and private groups",
        }
    if score >= 40:
        return {
            "label":               "Limited Access",
            "can_join_public":     False,
            "can_join_private":    True,
            "can_create_public":      False,
            "can_create_private":     True,
            "description":         "Private groups only — improve credit score to unlock public groups",
        }
    return {
        "label":               "Restricted",
        "can_join_public":     False,
        "can_join_private":    False,
        "can_create_public":      False,
        "can_create_private":     False,
        "description":         "Credit score too low to participate in any group",
    }