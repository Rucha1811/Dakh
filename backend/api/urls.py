from django.urls import path
from .views import (
    AuthRegisterView,
    AuthLoginView,
    ProductListCreateView,
    ProductDetailView,
    OrderListView,
    ShipmentListView,
    DNKListView,
    DocumentListView,
    SupportTicketListView,
    ComplianceRuleListView,
    SystemAnalyticsView,
    FeedbackListView,
    HealthCheckView,
    BackupStatusView,
    BackupExportView,
    BackupDownloadView,
    BackupSeedView,
    CollectionDataView,
)

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='system-health'),
    path('auth/register/', AuthRegisterView.as_view(), name='auth-register'),
    path('auth/login/', AuthLoginView.as_view(), name='auth-login'),
    path('products/', ProductListCreateView.as_view(), name='product-list-create'),
    path('products/<str:pk>/', ProductDetailView.as_view(), name='product-detail'),
    path('orders/', OrderListView.as_view(), name='order-list'),
    path('shipments/', ShipmentListView.as_view(), name='shipment-list'),
    path('dnks/', DNKListView.as_view(), name='dnk-list'),
    path('documents/', DocumentListView.as_view(), name='document-list'),
    path('support-tickets/', SupportTicketListView.as_view(), name='support-ticket-list'),
    path('compliance-rules/', ComplianceRuleListView.as_view(), name='compliance-rule-list'),
    path('analytics/', SystemAnalyticsView.as_view(), name='system-analytics'),
    path('feedback/', FeedbackListView.as_view(), name='feedback-list'),
    # Backup & Data Suite
    path('backup/status/', BackupStatusView.as_view(), name='backup-status'),
    path('backup/export/', BackupExportView.as_view(), name='backup-export'),
    path('backup/download/', BackupDownloadView.as_view(), name='backup-download'),
    path('backup/seed/', BackupSeedView.as_view(), name='backup-seed'),
    path('backup/collection/<str:collection_name>/', CollectionDataView.as_view(), name='backup-collection-data'),
]

