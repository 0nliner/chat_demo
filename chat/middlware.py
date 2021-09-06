import jwt, re
import traceback

from asgiref.sync import sync_to_async
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from django.conf import LazySettings
from jwt import InvalidSignatureError, ExpiredSignatureError, DecodeError
from urllib import parse

from .models import User


settings = LazySettings()


@database_sync_to_async
def get_user(user_id):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class TokenAuthMiddleware:
    def __init__(self, inner, *args, **kwargs):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        try:
            query = parse.parse_qs(scope['query_string'].decode("utf-8"))['token'][0]
            if query:
                try:
                    user_jwt = jwt.decode(
                        jwt=query,
                        key=settings.SECRET_KEY,
                    )
                    scope['user'] = await get_user(
                        user_id=user_jwt['user_id']
                    )
                    print(scope['user'])
                    return await self.inner(scope, receive, send)

                except (InvalidSignatureError, KeyError, ExpiredSignatureError, DecodeError):
                    traceback.print_exc()
                    pass
                except Exception as e:  # NoQA
                    traceback.print_exc()

            return await self.inner(scope, receive, send)
            # return self.inner(scope)

        except:
            scope['user'] = AnonymousUser()
            # return self.inner(scope)
            return await self.inner(scope, receive, send)


TokenAuthMiddlewareStack = lambda inner: TokenAuthMiddleware(AuthMiddlewareStack(inner))
