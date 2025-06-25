"""
ISP Management System - Dashboard URLs
Complete URL patterns for ISP management dashboard
File: dashboard/urls.py
"""

from django.urls import path, include
from . import views

app_name = 'dashboard'

urlpatterns = [

    # =============================================================================
    # MAIN DASHBOARD
    # =============================================================================
    path('', views.dashboard_overview, name='overview'),
    path('analytics/', views.dashboard_analytics, name='analytics'),

    # =============================================================================
    # CUSTOMER MANAGEMENT
    # =============================================================================
    path('clients/', views.customers_list, name='customers.index'),
    path('customers/create/', views.customer_create, name='customers.create'),
    path('customers/<int:customer_id>/', views.customer_detail, name='customers.show'),
    path('customers/<int:customer_id>/edit/', views.customer_edit, name='customers.edit'),
    path('customers/<int:customer_id>/profile/', views.customer_profile, name='customers.profile'),
    path('customers/<int:customer_id>/usage/', views.customer_usage, name='customers.usage'),
    path('customers/<int:customer_id>/billing/', views.customer_billing, name='customers.billing'),
    path('customers/import/', views.customers_import, name='customers.import'),

    # =============================================================================
    # PACKAGE MANAGEMENT
    # =============================================================================
    path('packages/', views.packages_list, name='packages.index'),
    path('packages/create/', views.package_create, name='packages.create'),
    path('packages/<int:package_id>/', views.package_detail, name='packages.show'),
    path('packages/<int:package_id>/edit/', views.package_edit, name='packages.edit'),
    path('packages/categories/', views.package_categories, name='packages.categories'),
    path('packages/pricing/', views.package_pricing, name='packages.pricing'),

    # =============================================================================
    # SUBSCRIPTION MANAGEMENT
    # =============================================================================
    path('subscriptions/', views.subscriptions_list, name='subscriptions.index'),
    path('subscriptions/create/', views.subscription_create, name='subscriptions.create'),
    path('subscriptions/<int:subscription_id>/', views.subscription_detail, name='subscriptions.show'),
    path('subscriptions/<int:subscription_id>/edit/', views.subscription_edit, name='subscriptions.edit'),
    path('subscriptions/<int:subscription_id>/activate/', views.subscription_activate, name='subscriptions.activate'),
    path('subscriptions/<int:subscription_id>/suspend/', views.subscription_suspend, name='subscriptions.suspend'),
    path('subscriptions/<int:subscription_id>/terminate/', views.subscription_terminate,
         name='subscriptions.terminate'),
    path('subscriptions/<int:subscription_id>/upgrade/', views.subscription_upgrade, name='subscriptions.upgrade'),

    # =============================================================================
    # NETWORK INFRASTRUCTURE
    # =============================================================================
    path('network/', views.network_overview, name='network.overview'),
    path('network/devices/', views.network_devices, name='network.devices'),
    path('network/devices/<int:device_id>/', views.network_device_detail, name='network.device.show'),
    path('network/zones/', views.network_zones, name='network.zones'),
    path('network/ip-management/', views.ip_address_management, name='network.ip_management'),
    path('network/monitoring/', views.network_monitoring, name='network.monitoring'),
    path('network/bandwidth/', views.network_bandwidth, name='network.bandwidth'),
    path('network/topology/', views.network_topology, name='network.topology'),

    # =============================================================================
    # SUPPORT TICKETING SYSTEM
    # =============================================================================
    path('tickets/', views.tickets_list, name='tickets.index'),
    path('tickets/create/', views.ticket_create, name='tickets.create'),
    path('tickets/<int:ticket_id>/', views.ticket_detail, name='tickets.show'),
    path('tickets/<int:ticket_id>/edit/', views.ticket_edit, name='tickets.edit'),
    path('tickets/<int:ticket_id>/assign/', views.ticket_assign, name='tickets.assign'),
    path('tickets/categories/', views.ticket_categories, name='tickets.categories'),
    path('tickets/sla/', views.tickets_sla, name='tickets.sla'),
    path('tickets/reports/', views.tickets_reports, name='tickets.reports'),

    # =============================================================================
    # BILLING & PAYMENTS
    # =============================================================================
    path('billing/', views.billing_overview, name='billing.overview'),
    path('billing/invoices/', views.invoices_list, name='billing.invoices'),
    path('billing/invoices/<int:invoice_id>/', views.invoice_detail, name='billing.invoice.show'),
    path('billing/invoices/create/', views.invoice_create, name='billing.invoice.create'),
    path('billing/payments/', views.payments_list, name='billing.payments'),
    path('billing/payments/record/', views.payment_record, name='billing.payment.record'),
    path('billing/overdue/', views.billing_overdue, name='billing.overdue'),
    path('billing/revenue/', views.billing_revenue, name='billing.revenue'),
    path('billing/settings/', views.billing_settings, name='billing.settings'),

    # =============================================================================
    # USAGE & ANALYTICS
    # =============================================================================
    path('usage/', views.usage_overview, name='usage.overview'),
    path('usage/sessions/', views.usage_sessions, name='usage.sessions'),
    path('usage/bandwidth/', views.usage_bandwidth, name='usage.bandwidth'),
    path('usage/top-users/', views.usage_top_users, name='usage.top_users'),
    path('usage/reports/', views.usage_reports, name='usage.reports'),
    path('usage/real-time/', views.usage_realtime, name='usage.realtime'),

    # =============================================================================
    # TEAM MANAGEMENT
    # =============================================================================
    path('team/', views.team_members, name='team.index'),
    path('team/create/', views.team_member_create, name='team.create'),
    path('team/<int:user_id>/', views.team_member_detail, name='team.show'),
    path('team/<int:user_id>/edit/', views.team_member_edit, name='team.edit'),
    path('team/roles/', views.team_roles, name='team.roles'),
    path('team/performance/', views.team_performance, name='team.performance'),
    path('team/schedules/', views.team_schedules, name='team.schedules'),

    # =============================================================================
    # REPORTS & ANALYTICS
    # =============================================================================
    path('reports/', views.reports_overview, name='reports.index'),
    path('reports/financial/', views.reports_financial, name='reports.financial'),
    path('reports/customer/', views.reports_customer, name='reports.customer'),
    path('reports/technical/', views.reports_technical, name='reports.technical'),
    path('reports/usage/', views.reports_usage, name='reports.usage'),
    path('reports/custom/', views.reports_custom, name='reports.custom'),
    path('reports/scheduled/', views.reports_scheduled, name='reports.scheduled'),

    # =============================================================================
    # SETTINGS & CONFIGURATION
    # =============================================================================
    path('settings/general/', views.settings_general, name='settings.general'),
    path('settings/company/', views.settings_company, name='settings.company'),
    path('settings/network/', views.settings_network, name='settings.network'),
    path('settings/radius/', views.settings_radius, name='settings.radius'),
    path('settings/mikrotik/', views.settings_mikrotik, name='settings.mikrotik'),
    path('settings/openvpn/', views.settings_openvpn, name='settings.openvpn'),
    path('settings/email/', views.settings_email, name='settings.email'),
    path('settings/sms/', views.settings_sms, name='settings.sms'),
    path('settings/backup/', views.settings_backup, name='settings.backup'),
    path('settings/integrations/', views.settings_integrations, name='settings.integrations'),

    # =============================================================================
    # TOOLS & UTILITIES
    # =============================================================================
    path('tools/ping/', views.tools_ping, name='tools.ping'),
    path('tools/traceroute/', views.tools_traceroute, name='tools.traceroute'),
    path('tools/bandwidth-test/', views.tools_bandwidth_test, name='tools.bandwidth_test'),
    path('tools/user-lookup/', views.tools_user_lookup, name='tools.user_lookup'),
    path('tools/session-manager/', views.tools_session_manager, name='tools.session_manager'),
    path('tools/bulk-actions/', views.tools_bulk_actions, name='tools.bulk_actions'),

    # =============================================================================
    # SYSTEM MONITORING
    # =============================================================================
    path('monitoring/system/', views.monitoring_system, name='monitoring.system'),
    path('monitoring/services/', views.monitoring_services, name='monitoring.services'),
    path('monitoring/logs/', views.monitoring_logs, name='monitoring.logs'),
    path('monitoring/alerts/', views.monitoring_alerts, name='monitoring.alerts'),
    path('monitoring/performance/', views.monitoring_performance, name='monitoring.performance'),

    # =============================================================================
    # MOBILE/TECHNICIAN VIEWS
    # =============================================================================
    path('mobile/', views.mobile_dashboard, name='mobile.dashboard'),
    path('mobile/tickets/', views.mobile_tickets, name='mobile.tickets'),
    path('mobile/installations/', views.mobile_installations, name='mobile.installations'),
    path('mobile/customer-lookup/', views.mobile_customer_lookup, name='mobile.customer_lookup'),

    # =============================================================================
    # CUSTOMER PORTAL VIEWS (if integrated)
    # =============================================================================
    path('portal/', views.portal_dashboard, name='portal.dashboard'),
    path('portal/usage/', views.portal_usage, name='portal.usage'),
    path('portal/billing/', views.portal_billing, name='portal.billing'),
    path('portal/support/', views.portal_support, name='portal.support'),
    path('portal/profile/', views.portal_profile, name='portal.profile'),

    # =============================================================================
    # API ENDPOINTS FOR AJAX REQUESTS
    # =============================================================================
    path('api/customers/search/', views.api_customer_search, name='api.customers.search'),
    path('api/usage/stats/', views.api_usage_stats, name='api.usage.stats'),
    path('api/network/status/', views.api_network_status, name='api.network.status'),
    path('api/tickets/assign/', views.api_ticket_assign, name='api.tickets.assign'),
    path('api/users/actions/', views.api_user_actions, name='api.users.actions'),
]

# =============================================================================
# ADDITIONAL URL PATTERNS FOR INTEGRATION
# =============================================================================

# Include these patterns in your main urls.py:
"""
# In your main urls.py file:

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('dashboard/', include('dashboard.urls')),  # Main dashboard
    path('api/', include('api.urls')),              # API endpoints
    path('', include('landing.urls')),              # Landing pages
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
"""

# =============================================================================
# MIDDLEWARE INTEGRATION PATTERNS
# =============================================================================

# Additional URL patterns for Flask middleware integration:
"""
# Flask middleware communication endpoints
path('middleware/sync/', views.middleware_sync, name='middleware.sync'),
path('middleware/webhook/', views.middleware_webhook, name='middleware.webhook'),
path('middleware/status/', views.middleware_status, name='middleware.status'),

# RADIUS integration endpoints  
path('radius/auth/', views.radius_auth_callback, name='radius.auth'),
path('radius/accounting/', views.radius_accounting_callback, name='radius.accounting'),

# MikroTik integration endpoints
path('mikrotik/callback/', views.mikrotik_callback, name='mikrotik.callback'),
path('mikrotik/status/', views.mikrotik_status, name='mikrotik.status'),

# OpenVPN integration endpoints
path('openvpn/client-connect/', views.openvpn_client_connect, name='openvpn.client_connect'),
path('openvpn/client-disconnect/', views.openvpn_client_disconnect, name='openvpn.client_disconnect'),
"""

# =============================================================================
# GROUPED URL PATTERNS FOR BETTER ORGANIZATION
# =============================================================================

# Alternative organization using URL groups:
"""
# Customer Management URLs
customer_patterns = [
    path('', views.customers_list, name='index'),
    path('create/', views.customer_create, name='create'),
    path('<int:customer_id>/', views.customer_detail, name='show'),
    path('<int:customer_id>/edit/', views.customer_edit, name='edit'),
    path('<int:customer_id>/profile/', views.customer_profile, name='profile'),
    path('<int:customer_id>/usage/', views.customer_usage, name='usage'),
    path('<int:customer_id>/billing/', views.customer_billing, name='billing'),
    path('import/', views.customers_import, name='import'),
]

# Package Management URLs
package_patterns = [
    path('', views.packages_list, name='index'),
    path('create/', views.package_create, name='create'),
    path('<int:package_id>/', views.package_detail, name='show'),
    path('<int:package_id>/edit/', views.package_edit, name='edit'),
    path('categories/', views.package_categories, name='categories'),
    path('pricing/', views.package_pricing, name='pricing'),
]

# Main URL patterns with groups
urlpatterns = [
    path('', views.dashboard_overview, name='overview'),
    path('customers/', include((customer_patterns, 'customers'))),
    path('packages/', include((package_patterns, 'packages'))),
    # ... other patterns
]
"""

# =============================================================================
# BREADCRUMB HELPER FOR INERTIA VIEWS
# =============================================================================

# Helper function to generate breadcrumbs for Inertia views:
"""
def get_breadcrumbs(view_name, **kwargs):
    breadcrumbs = {
        'dashboard.overview': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')}
        ],
        'customers.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Customers', 'url': reverse('dashboard:customers.index')}
        ],
        'customers.show': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Customers', 'url': reverse('dashboard:customers.index')},
            {'label': 'Customer Details', 'url': '#'}
        ],
        # Add more breadcrumb mappings as needed
    }
    return breadcrumbs.get(view_name, [])

# Use in views like:
# return {
#     'breadcrumbs': get_breadcrumbs('customers.show'),
#     'customer': customer_data
# }
"""