import datetime as dt
import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer

from django.contrib.auth.models import User

from chat.models import Dialog
from chat.serializers import UserSerializer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        # подключаем пользователя к чату только если он состоит с диалоге
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        dialog = Dialog.objects.get(id=int(self.room_name))
        self.dialog = dialog

        if bool(dialog and list(dialog.users.filter(id=self.scope["user"].id).all())):
            async_to_sync(self.channel_layer.group_add)(
                self.room_group_name,
                self.channel_name
            )

            self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        message = self.dialog.messages.create(
            text=message,
            sender=self.scope["user"],
        )
        message.save()

        print(self.scope["user"])
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',

                "text": message.text,
                "from_user": self.scope["user"].username,
                "sender_id": self.scope["user"].id,
                "datetime": str(message.datetime)
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        # message = event['message']
        print(self.scope["user"])

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            **event
        }))


class FindUserConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        substring = text_data_json['substring']

        users = User.objects.filter(username__contains=substring)
        serialized_users = UserSerializer(data=users, many=True)
        serialized_users.is_valid()

        self.send(text_data=json.dumps({
            'users': serialized_users.data
        }))
