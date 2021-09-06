import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import OriginValidator
from django.core.asgi import get_asgi_application
import chat.routing
#
from chat.middlware import TokenAuthMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'chat_example.settings')


application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": OriginValidator(
      TokenAuthMiddleware(
            URLRouter(
                chat.routing.websocket_urlpatterns
            ),
        ),
        ["*"]
    )
})
