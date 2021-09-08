from rest_framework import serializers
from .models import User, Dialog, Message


class MessageSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    dialog = serializers.PrimaryKeyRelatedField(read_only=True)
    sender = serializers.PrimaryKeyRelatedField(read_only=True)
    datetime = serializers.DateTimeField(read_only=True)
    from_user = serializers.SerializerMethodField(source="get_from_user")

    class Meta:
        exclude = []
        model = Message

    def get_from_user(self, obj):
        return obj.sender.username


class DialogSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    users = serializers.PrimaryKeyRelatedField(many=True, required=False, queryset=User.objects.all())
    messages = serializers.PrimaryKeyRelatedField(read_only=True, many=True, default=[])

    class Meta:
        exclude = []
        model = Dialog


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # TODO: добавить исключения
        # exclude = ["all_messages", "dialogs",]
        exclude = []
        model = User


class UserCreationSerializer(serializers.Serializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    dialog_id = serializers.PrimaryKeyRelatedField(queryset=Dialog.objects.all())
