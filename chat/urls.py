from django.urls import path
from rest_framework.routers import SimpleRouter

from .viewsets import DialogViewSet
from . import views

router = SimpleRouter()
router.register("dialogs", DialogViewSet, basename="dialogs")
# router.register("messages", MessageSerializer, basename="messages")


urlpatterns = [
    *router.urls,

    # path('', views.index, name='index'),
    path('<str:room_name>/', views.room, name='room'),
]
