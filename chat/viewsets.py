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

        user = get_object_or_404(User, id=serializer.data["user_id"])
        dialog = get_object_or_404(Dialog, id=serializer.data["dialog_id"])

        dialog.users.add(user)
        dialog.save()

        return Response(status=status.HTTP_201_CREATED)

    @action(methods=["GET"], detail=False, url_path=r"get_messages/(?P<pk>[^/.]+)")
    def get_messages(self, request, pk):
        # TODO: отрефакторить
        try:
            messages = get_object_or_404(Dialog, id=pk).messages.order_by("datetime")[:1000]
        except TypeError:
            messages = []

        serialized_messages = MessageSerializer(data=messages, many=True)
        serialized_messages.is_valid()

        return Response(data=serialized_messages.data, status=status.HTTP_200_OK)

