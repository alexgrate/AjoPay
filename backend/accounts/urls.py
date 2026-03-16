from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterViewset, LoginViewset, LogoutViewset,
    ProfileView, ChangePasswordView, DeleteAccountView,
    BVNVerificationView, CreditScoreView,
)

router = DefaultRouter()
router.register('register', RegisterViewset, basename='register')
router.register('login',    LoginViewset,    basename='login')
router.register("logout",   LogoutViewset,   basename="logout")

urlpatterns = router.urls + [
    path("token/refresh/",   TokenRefreshView.as_view(),   name="token_refresh"),
    path("profile/",         ProfileView.as_view(),         name="profile"),
    path("change-password/", ChangePasswordView.as_view(),  name="change_password"),
    path("delete-account/",  DeleteAccountView.as_view(),   name="delete_account"),
    path("verify-bvn/",      BVNVerificationView.as_view(), name="verify_bvn"),
    path("credit-score/",    CreditScoreView.as_view(),     name="credit_score"),
]