from django.db import models
from django.contrib.auth.models import User


class Dialog(models.Model):

    users = models.ManyToManyField(User, related_name="dialogs")

    class Meta:
        verbose_name = "диалоги"
        verbose_name_plural = "диалог"


class Message(models.Model):
    dialog = models.ForeignKey(Dialog, related_name="messages", on_delete=models.CASCADE, verbose_name="диалог",
                               blank=True, null=True)

    sender = models.ForeignKey(User, related_name="all_messages", on_delete=models.CASCADE, verbose_name="отправитель",
                               blank=True, null=True)

    text = models.TextField(max_length=1024, blank=True, null=True)
    datetime = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "сообщения"
        verbose_name_plural = "сообщение"

    def __str__(self):
        return f"{self.sender.name}\t{self.datetime}"

