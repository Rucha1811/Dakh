from django.urls import path
from .views import AIChatView, AIHealthView

urlpatterns = [
    path('chat/', AIChatView.as_view(), name='ai-chat'),
    path('health/', AIHealthView.as_view(), name='ai-health'),
]
