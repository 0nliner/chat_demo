from django.conf.urls import url
from django.urls import re_path, path

from . import consumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumer.ChatConsumer.as_asgi()),
    re_path(r'ws/user_search/$', consumer.FindUserConsumer.as_asgi()),
]