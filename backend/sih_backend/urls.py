"""
URL configuration for sih_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from api.views import BackendPortalView, HealthCheckView

urlpatterns = [
    # Single-Page Enterprise Backend Console
    path('', BackendPortalView.as_view(), name='backend-portal'),
    path('health/', HealthCheckView.as_view(), name='root-health'),
    
    # Core APIs
    path('admin/', admin.site.urls),
    path('api/assistant/', include('ai_assistant.urls')),
    path('api/', include('api.urls')),
]

