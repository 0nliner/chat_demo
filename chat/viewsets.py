from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework import mixins, status
from .serializers import MessageSerializer, DialogSerializer, UserCreationSerializer
from .models import Message, Dialog, User

from rest_framework.decorators import action


class DialogViewSet(GenericViewSet,
                    mixins.ListModelMixin,
                    mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.DestroyModelMixin):

    serializer_class = DialogSerializer
    queryset = Dialog.objects.all()
    model = Dialog

    def get_queryset(self):
        if self.request.user:
            return super().get_queryset().filter(users__username__contains=self.request.user.username)
        else:
            return

    def perform_create(self, serializer):
        dialog_instance: Dialog = serializer.save()
        dialog_instance.users.add(self.request.user)
        dialog_instance.save()

    # TODO: удаление чата

    # TODO: добавление пользователя
    @action(methods=["POST"], detail=False)
    def add_user(self, request):
        serializer = UserCreationSerializer(data=request.data)
        serializer.is_valid()
        # print(serializer.data[])

        user = get_object_or_404(User, id=serializer.data["user_id"])
        dialog = get_object_or_404(Dialog, id=serializer.data["dialog_id"])

        dialog.users.add(user)
        dialog.save()

        return Response(status=status.HTTP_201_CREATED)


