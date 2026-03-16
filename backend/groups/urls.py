from rest_framework.routers import DefaultRouter
from .views import GroupViewset

router = DefaultRouter()
router.register("groups", GroupViewset, basename="groups")
urlpatterns = router.urls