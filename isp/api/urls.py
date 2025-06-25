# =============================================================================
# EXAMPLE API URLS
# =============================================================================
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'api'

# DRF Router for ViewSets
router = DefaultRouter()
router.register(r'customers', views.CustomerViewSet, basename='customer')
router.register(r'packages', views.PackageViewSet, basename='package')
router.register(r'subscriptions', views.SubscriptionViewSet, basename='subscription')

router.register(r'tickets', views.TicketViewSet, basename='ticket')
router.register(r'invoices', views.InvoiceViewSet, basename='invoice')
router.register(r'payments', views.PaymentViewSet, basename='payment')

urlpatterns = [
    # DRF Router URLs
    path('', include(router.urls)),

    # Custom API endpoints
    path('auth/token/', views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', views.CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('auth/token/verify/', views.CustomTokenVerifyView.as_view(), name='token_verify'),

    # Statistics and Analytics
    path('stats/dashboard/', views.DashboardStatsView.as_view(), name='dashboard_stats'),
    path('stats/usage/', views.UsageStatsView.as_view(), name='usage_stats'),
    path('stats/revenue/', views.RevenueStatsView.as_view(), name='revenue_stats'),

    # Real-time endpoints
    path('realtime/sessions/', views.ActiveSessionsView.as_view(), name='active_sessions'),
    path('realtime/bandwidth/', views.BandwidthUsageView.as_view(), name='bandwidth_usage'),
    path('realtime/alerts/', views.SystemAlertsView.as_view(), name='system_alerts'),

    # Integration endpoints (for Flask middleware)
    path('integration/radius/', views.RadiusIntegrationView.as_view(), name='radius_integration'),
    path('integration/mikrotik/', views.MikroTikIntegrationView.as_view(), name='mikrotik_integration'),
    path('integration/webhook/', views.WebhookView.as_view(), name='webhook'),

    # Bulk operations
    path('bulk/customers/', views.BulkCustomerOperationsView.as_view(), name='bulk_customers'),
    path('bulk/subscriptions/', views.BulkSubscriptionOperationsView.as_view(), name='bulk_subscriptions'),

    # Reports and exports
    path('export/customers/', views.ExportCustomersView.as_view(), name='export_customers'),
    path('export/usage/', views.ExportUsageView.as_view(), name='export_usage'),
    path('export/invoices/', views.ExportInvoicesView.as_view(), name='export_invoices'),
]
