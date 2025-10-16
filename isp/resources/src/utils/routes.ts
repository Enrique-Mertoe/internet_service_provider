// Auto-generated routes file - DO NOT EDIT
// Generated from Django URLs

export interface RouteParameters {
  [key: string]: string | number;
}

export interface RouteDefinition {
  uri: string;
  methods: string[];
  parameters: string[];
  domain: string | null;
}

export interface Routes {
  [key: string]: RouteDefinition;
}

export const routes: Routes = {
  "js_reverse_json": {
    "uri": "jsreverse.json/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:overview": {
    "uri": "dashboard/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:analytics": {
    "uri": "dashboard/analytics/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:equipments.index": {
    "uri": "dashboard/network/equipments/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.index": {
    "uri": "dashboard/clients/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.create": {
    "uri": "dashboard/customers/create/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.show": {
    "uri": "dashboard/customers/<int:customer_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.edit": {
    "uri": "dashboard/customers/<int:customer_id>/edit/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.profile": {
    "uri": "dashboard/customers/<int:customer_id>/profile/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.usage": {
    "uri": "dashboard/customers/<int:customer_id>/usage/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.billing": {
    "uri": "dashboard/customers/<int:customer_id>/billing/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:customers.import": {
    "uri": "dashboard/customers/import/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:packages.index": {
    "uri": "dashboard/packages/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:packages.create": {
    "uri": "dashboard/packages/create/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:packages.show": {
    "uri": "dashboard/packages/<int:package_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:packages.edit": {
    "uri": "dashboard/packages/<int:package_id>/edit/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:packages.categories": {
    "uri": "dashboard/packages/categories/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:packages.pricing": {
    "uri": "dashboard/packages/pricing/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.index": {
    "uri": "dashboard/subscriptions/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.create": {
    "uri": "dashboard/subscriptions/create/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.show": {
    "uri": "dashboard/subscriptions/<int:subscription_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.edit": {
    "uri": "dashboard/subscriptions/<int:subscription_id>/edit/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.activate": {
    "uri": "dashboard/subscriptions/<int:subscription_id>/activate/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.suspend": {
    "uri": "dashboard/subscriptions/<int:subscription_id>/suspend/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.terminate": {
    "uri": "dashboard/subscriptions/<int:subscription_id>/terminate/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:subscriptions.upgrade": {
    "uri": "dashboard/subscriptions/<int:subscription_id>/upgrade/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.overview": {
    "uri": "dashboard/network/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.devices": {
    "uri": "dashboard/network/devices/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.device.show": {
    "uri": "dashboard/network/devices/<int:device_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.zones": {
    "uri": "dashboard/network/zones/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.ip_management": {
    "uri": "dashboard/network/ip-management/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.monitoring": {
    "uri": "dashboard/network/monitoring/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.bandwidth": {
    "uri": "dashboard/network/bandwidth/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:network.topology": {
    "uri": "dashboard/network/topology/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.index": {
    "uri": "dashboard/tickets/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.create": {
    "uri": "dashboard/tickets/create/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.show": {
    "uri": "dashboard/tickets/<int:ticket_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.edit": {
    "uri": "dashboard/tickets/<int:ticket_id>/edit/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.assign": {
    "uri": "dashboard/tickets/<int:ticket_id>/assign/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.categories": {
    "uri": "dashboard/tickets/categories/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.sla": {
    "uri": "dashboard/tickets/sla/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tickets.reports": {
    "uri": "dashboard/tickets/reports/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.overview": {
    "uri": "dashboard/billing/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.invoices": {
    "uri": "dashboard/billing/invoices/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.invoice.show": {
    "uri": "dashboard/billing/invoices/<int:invoice_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.invoice.create": {
    "uri": "dashboard/billing/invoices/create/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.payments": {
    "uri": "dashboard/billing/payments/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.payment.record": {
    "uri": "dashboard/billing/payments/record/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.overdue": {
    "uri": "dashboard/billing/overdue/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.revenue": {
    "uri": "dashboard/billing/revenue/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:billing.settings": {
    "uri": "dashboard/billing/settings/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:usage.overview": {
    "uri": "dashboard/usage/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:usage.sessions": {
    "uri": "dashboard/usage/sessions/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:usage.bandwidth": {
    "uri": "dashboard/usage/bandwidth/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:usage.top_users": {
    "uri": "dashboard/usage/top-users/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:usage.reports": {
    "uri": "dashboard/usage/reports/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:usage.realtime": {
    "uri": "dashboard/usage/real-time/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.index": {
    "uri": "dashboard/team/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.create": {
    "uri": "dashboard/team/create/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.show": {
    "uri": "dashboard/team/<int:user_id>",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.edit": {
    "uri": "dashboard/team/<int:user_id>/edit/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.roles": {
    "uri": "dashboard/team/roles/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.performance": {
    "uri": "dashboard/team/performance/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:team.schedules": {
    "uri": "dashboard/team/schedules/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.index": {
    "uri": "dashboard/reports/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.financial": {
    "uri": "dashboard/reports/financial/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.customer": {
    "uri": "dashboard/reports/customer/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.technical": {
    "uri": "dashboard/reports/technical/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.usage": {
    "uri": "dashboard/reports/usage/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.custom": {
    "uri": "dashboard/reports/custom/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:reports.scheduled": {
    "uri": "dashboard/reports/scheduled/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.general": {
    "uri": "dashboard/settings/general/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.company": {
    "uri": "dashboard/settings/company/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.network": {
    "uri": "dashboard/settings/network/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.radius": {
    "uri": "dashboard/settings/radius/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.mikrotik": {
    "uri": "dashboard/settings/mikrotik/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.openvpn": {
    "uri": "dashboard/settings/openvpn/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.email": {
    "uri": "dashboard/settings/email/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.sms": {
    "uri": "dashboard/settings/sms/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.backup": {
    "uri": "dashboard/settings/backup/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:settings.integrations": {
    "uri": "dashboard/settings/integrations/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tools.ping": {
    "uri": "dashboard/tools/ping/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tools.traceroute": {
    "uri": "dashboard/tools/traceroute/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tools.bandwidth_test": {
    "uri": "dashboard/tools/bandwidth-test/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tools.user_lookup": {
    "uri": "dashboard/tools/user-lookup/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tools.session_manager": {
    "uri": "dashboard/tools/session-manager/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:tools.bulk_actions": {
    "uri": "dashboard/tools/bulk-actions/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:monitoring.system": {
    "uri": "dashboard/monitoring/system/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:monitoring.services": {
    "uri": "dashboard/monitoring/services/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:monitoring.logs": {
    "uri": "dashboard/monitoring/logs/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:monitoring.alerts": {
    "uri": "dashboard/monitoring/alerts/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:monitoring.performance": {
    "uri": "dashboard/monitoring/performance/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:mobile.dashboard": {
    "uri": "dashboard/mobile/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:mobile.tickets": {
    "uri": "dashboard/mobile/tickets/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:mobile.installations": {
    "uri": "dashboard/mobile/installations/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:mobile.customer_lookup": {
    "uri": "dashboard/mobile/customer-lookup/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:portal.dashboard": {
    "uri": "dashboard/portal/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:portal.usage": {
    "uri": "dashboard/portal/usage/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:portal.billing": {
    "uri": "dashboard/portal/billing/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:portal.support": {
    "uri": "dashboard/portal/support/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:portal.profile": {
    "uri": "dashboard/portal/profile/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:api.customers.search": {
    "uri": "dashboard/api/customers/search/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:api.usage.stats": {
    "uri": "dashboard/api/usage/stats/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:api.network.status": {
    "uri": "dashboard/api/network/status/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:api.tickets.assign": {
    "uri": "dashboard/api/tickets/assign/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "dashboard:api.users.actions": {
    "uri": "dashboard/api/users/actions/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "api:customer-list": {
    "uri": "api/v1/customers.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:customer-default": {
    "uri": "api/v1/customers/default.<format>",
    "methods": [
      "GET"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:customer-detail": {
    "uri": "api/v1/customers/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:users-list": {
    "uri": "api/v1/users.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:users-me": {
    "uri": "api/v1/users/me.<format>",
    "methods": [
      "GET"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:users-update-me": {
    "uri": "api/v1/users/update_me.<format>",
    "methods": [
      "PATCH",
      "PUT"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:users-detail": {
    "uri": "api/v1/users/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:package-list": {
    "uri": "api/v1/packages.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:package-default": {
    "uri": "api/v1/packages/default.<format>",
    "methods": [
      "GET"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:package-detail": {
    "uri": "api/v1/packages/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:subscription-list": {
    "uri": "api/v1/subscriptions.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:subscription-detail": {
    "uri": "api/v1/subscriptions/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:ticket-list": {
    "uri": "api/v1/tickets.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:ticket-detail": {
    "uri": "api/v1/tickets/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:equipment-list": {
    "uri": "api/v1/equipments.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:equipment-default": {
    "uri": "api/v1/equipments/default.<format>",
    "methods": [
      "GET"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:equipment-provision": {
    "uri": "api/v1/equipments/provision.<format>",
    "methods": [
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:equipment-detail": {
    "uri": "api/v1/equipments/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:invoice-list": {
    "uri": "api/v1/invoices.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:invoice-detail": {
    "uri": "api/v1/invoices/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:payment-list": {
    "uri": "api/v1/payments.<format>",
    "methods": [
      "GET",
      "POST"
    ],
    "parameters": [
      "format"
    ],
    "domain": null
  },
  "api:payment-detail": {
    "uri": "api/v1/payments/<pk>.<format>",
    "methods": [
      "GET",
      "PUT",
      "PATCH",
      "DELETE"
    ],
    "parameters": [
      "pk",
      "format"
    ],
    "domain": null
  },
  "api:api-root": {
    "uri": "api/v1/<drf_format_suffix:format>",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:token_obtain_pair": {
    "uri": "api/v1/auth/token/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:token_refresh": {
    "uri": "api/v1/auth/token/refresh/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:token_verify": {
    "uri": "api/v1/auth/token/verify/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:dashboard_stats": {
    "uri": "api/v1/stats/dashboard/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:usage_stats": {
    "uri": "api/v1/stats/usage/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:revenue_stats": {
    "uri": "api/v1/stats/revenue/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:active_sessions": {
    "uri": "api/v1/realtime/sessions/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:bandwidth_usage": {
    "uri": "api/v1/realtime/bandwidth/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:system_alerts": {
    "uri": "api/v1/realtime/alerts/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:radius_integration": {
    "uri": "api/v1/integration/radius/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:mikrotik_integration": {
    "uri": "api/v1/integration/mikrotik/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:webhook": {
    "uri": "api/v1/integration/webhook/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:bulk_customers": {
    "uri": "api/v1/bulk/customers/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:bulk_subscriptions": {
    "uri": "api/v1/bulk/subscriptions/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:export_customers": {
    "uri": "api/v1/export/customers/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:export_usage": {
    "uri": "api/v1/export/usage/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:export_invoices": {
    "uri": "api/v1/export/invoices/",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:equipment_authorize": {
    "uri": "api/v1/equipments/auth/<str:encoded_payload>",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:equipment_cert": {
    "uri": "api/v1/equipments/auth/cert/<str:auth_code>",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:equipment_config": {
    "uri": "api/v1/equipments/auth/config/<str:encoded_payload>/ovpn/<int:version>",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "api:hotspot_file": {
    "uri": "api/v1/mikrotik/hotspot/<str:router_identity>/<str:file_name>",
    "methods": [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "TRACE"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:login": {
    "uri": "auth/login/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:logout": {
    "uri": "auth/logout/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:register": {
    "uri": "auth/register/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:company_setup": {
    "uri": "auth/company-setup/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:password_reset": {
    "uri": "auth/password/reset/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:password_reset_confirm": {
    "uri": "auth/password/reset/confirm/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:profile": {
    "uri": "auth/profile/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "auth:change_password": {
    "uri": "auth/change-password/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:index": {
    "uri": "/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:about": {
    "uri": "about/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:services": {
    "uri": "services/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:packages": {
    "uri": "packages/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:contact": {
    "uri": "contact/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:support": {
    "uri": "support/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:terms": {
    "uri": "terms/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  },
  "landing:privacy": {
    "uri": "privacy/",
    "methods": [
      "GET"
    ],
    "parameters": [],
    "domain": null
  }
};

export class Router {
  private readonly routes: Routes;
  private readonly baseUrl: string;

  constructor(routes: Routes, baseUrl = '') {
    this.routes = routes;
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Check if a route exists
   */
  has(name: string): boolean {
    return name in this.routes;
  }

  /**
   * Get route definition
   */
  get(name: string): RouteDefinition | undefined {
    return this.routes[name];
  }

  /**
   * Generate URL for a named route
   */
  route(name: string, parameters: RouteParameters = {}, absolute = false): string {
    const routeDefinition = this.routes[name];

    if (!routeDefinition) {
      throw new Error(`Route "${name}" not found`);
    }

    let url = routeDefinition.uri;

    // Replace URL parameter patterns with actual values
    // Handle both Django patterns and cleaned patterns
    
    // Replace cleaned patterns like <param_name>
    url = url.replace(/<(\w+)>/g, (match, paramName) => {
      if (!(paramName in parameters)) {
        throw new Error(`Missing required parameter "${paramName}" for route "${name}"`);
      }
      return String(parameters[paramName]);
    });
    
    // Replace Django regex patterns (?P<param_name>pattern)
    url = url.replace(/\(\?P<(\w+)>[^)]+\)/g, (match, paramName) => {
      if (!(paramName in parameters)) {
        throw new Error(`Missing required parameter "${paramName}" for route "${name}"`);
      }
      return String(parameters[paramName]);
    });

    // Remove Django regex anchors and clean up
    url = url.replace(/^\^/, '').replace(/\$$/, '').replace(/\\\\./g, '.');

    // Add query parameters for extra parameters
    const usedParams = new Set(routeDefinition.parameters);
    const queryParams = Object.entries(parameters)
      .filter(([key]) => !usedParams.has(key))
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    if (queryParams) {
      url += url.includes('?') ? '&' + queryParams : '?' + queryParams;
    }

    // Add base URL if absolute
    if (absolute) {
      return this.baseUrl + '/' + url.replace(/^\//, '');
    }

    return '/' + url.replace(/^\//, '');
  }

  /**
   * Get current route name (requires additional setup with React Router)
   */
  current(): string | null {
    // This would need to be implemented with React Router integration
    return null;
  }

  /**
   * Get all route names
   */
  list(): string[] {
    return Object.keys(this.routes);
  }
}

// Global router instance
export const router = new Router(routes, import.meta.env.VITE_APP_API_URL || '');

// Helper function for easier usage
export function route(name: string, parameters: RouteParameters = {}, absolute = false): string {
  return router.route(name, parameters, absolute);
}

// Export route names as constants for better IDE support
export const ROUTES = {
  JS_REVERSE_JSON: 'js_reverse_json',
  DASHBOARD_OVERVIEW: 'dashboard:overview',
  DASHBOARD_ANALYTICS: 'dashboard:analytics',
  "DASHBOARD_EQUIPMENTS.INDEX": 'dashboard:equipments.index',
  "DASHBOARD_CUSTOMERS.INDEX": 'dashboard:customers.index',
  "DASHBOARD_CUSTOMERS.CREATE": 'dashboard:customers.create',
  "DASHBOARD_CUSTOMERS.SHOW": 'dashboard:customers.show',
  "DASHBOARD_CUSTOMERS.EDIT": 'dashboard:customers.edit',
  "DASHBOARD_CUSTOMERS.PROFILE": 'dashboard:customers.profile',
  "DASHBOARD_CUSTOMERS.USAGE": 'dashboard:customers.usage',
  "DASHBOARD_CUSTOMERS.BILLING": 'dashboard:customers.billing',
  "DASHBOARD_CUSTOMERS.IMPORT": 'dashboard:customers.import',
  "DASHBOARD_PACKAGES.INDEX": 'dashboard:packages.index',
  "DASHBOARD_PACKAGES.CREATE": 'dashboard:packages.create',
  "DASHBOARD_PACKAGES.SHOW": 'dashboard:packages.show',
  "DASHBOARD_PACKAGES.EDIT": 'dashboard:packages.edit',
  "DASHBOARD_PACKAGES.CATEGORIES": 'dashboard:packages.categories',
  "DASHBOARD_PACKAGES.PRICING": 'dashboard:packages.pricing',
  "DASHBOARD_SUBSCRIPTIONS.INDEX": 'dashboard:subscriptions.index',
  "DASHBOARD_SUBSCRIPTIONS.CREATE": 'dashboard:subscriptions.create',
  "DASHBOARD_SUBSCRIPTIONS.SHOW": 'dashboard:subscriptions.show',
  "DASHBOARD_SUBSCRIPTIONS.EDIT": 'dashboard:subscriptions.edit',
  "DASHBOARD_SUBSCRIPTIONS.ACTIVATE": 'dashboard:subscriptions.activate',
  "DASHBOARD_SUBSCRIPTIONS.SUSPEND": 'dashboard:subscriptions.suspend',
  "DASHBOARD_SUBSCRIPTIONS.TERMINATE": 'dashboard:subscriptions.terminate',
  "DASHBOARD_SUBSCRIPTIONS.UPGRADE": 'dashboard:subscriptions.upgrade',
  "DASHBOARD_NETWORK.OVERVIEW": 'dashboard:network.overview',
  "DASHBOARD_NETWORK.DEVICES": 'dashboard:network.devices',
  "DASHBOARD_NETWORK.DEVICE.SHOW": 'dashboard:network.device.show',
  "DASHBOARD_NETWORK.ZONES": 'dashboard:network.zones',
  "DASHBOARD_NETWORK.IP_MANAGEMENT": 'dashboard:network.ip_management',
  "DASHBOARD_NETWORK.MONITORING": 'dashboard:network.monitoring',
  "DASHBOARD_NETWORK.BANDWIDTH": 'dashboard:network.bandwidth',
  "DASHBOARD_NETWORK.TOPOLOGY": 'dashboard:network.topology',
  "DASHBOARD_TICKETS.INDEX": 'dashboard:tickets.index',
  "DASHBOARD_TICKETS.CREATE": 'dashboard:tickets.create',
  "DASHBOARD_TICKETS.SHOW": 'dashboard:tickets.show',
  "DASHBOARD_TICKETS.EDIT": 'dashboard:tickets.edit',
  "DASHBOARD_TICKETS.ASSIGN": 'dashboard:tickets.assign',
  "DASHBOARD_TICKETS.CATEGORIES": 'dashboard:tickets.categories',
  "DASHBOARD_TICKETS.SLA": 'dashboard:tickets.sla',
  "DASHBOARD_TICKETS.REPORTS": 'dashboard:tickets.reports',
  "DASHBOARD_BILLING.OVERVIEW": 'dashboard:billing.overview',
  "DASHBOARD_BILLING.INVOICES": 'dashboard:billing.invoices',
  "DASHBOARD_BILLING.INVOICE.SHOW": 'dashboard:billing.invoice.show',
  "DASHBOARD_BILLING.INVOICE.CREATE": 'dashboard:billing.invoice.create',
  "DASHBOARD_BILLING.PAYMENTS": 'dashboard:billing.payments',
  "DASHBOARD_BILLING.PAYMENT.RECORD": 'dashboard:billing.payment.record',
  "DASHBOARD_BILLING.OVERDUE": 'dashboard:billing.overdue',
  "DASHBOARD_BILLING.REVENUE": 'dashboard:billing.revenue',
  "DASHBOARD_BILLING.SETTINGS": 'dashboard:billing.settings',
  "DASHBOARD_USAGE.OVERVIEW": 'dashboard:usage.overview',
  "DASHBOARD_USAGE.SESSIONS": 'dashboard:usage.sessions',
  "DASHBOARD_USAGE.BANDWIDTH": 'dashboard:usage.bandwidth',
  "DASHBOARD_USAGE.TOP_USERS": 'dashboard:usage.top_users',
  "DASHBOARD_USAGE.REPORTS": 'dashboard:usage.reports',
  "DASHBOARD_USAGE.REALTIME": 'dashboard:usage.realtime',
  "DASHBOARD_TEAM.INDEX": 'dashboard:team.index',
  "DASHBOARD_TEAM.CREATE": 'dashboard:team.create',
  "DASHBOARD_TEAM.SHOW": 'dashboard:team.show',
  "DASHBOARD_TEAM.EDIT": 'dashboard:team.edit',
  "DASHBOARD_TEAM.ROLES": 'dashboard:team.roles',
  "DASHBOARD_TEAM.PERFORMANCE": 'dashboard:team.performance',
  "DASHBOARD_TEAM.SCHEDULES": 'dashboard:team.schedules',
  "DASHBOARD_REPORTS.INDEX": 'dashboard:reports.index',
  "DASHBOARD_REPORTS.FINANCIAL": 'dashboard:reports.financial',
  "DASHBOARD_REPORTS.CUSTOMER": 'dashboard:reports.customer',
  "DASHBOARD_REPORTS.TECHNICAL": 'dashboard:reports.technical',
  "DASHBOARD_REPORTS.USAGE": 'dashboard:reports.usage',
  "DASHBOARD_REPORTS.CUSTOM": 'dashboard:reports.custom',
  "DASHBOARD_REPORTS.SCHEDULED": 'dashboard:reports.scheduled',
  "DASHBOARD_SETTINGS.GENERAL": 'dashboard:settings.general',
  "DASHBOARD_SETTINGS.COMPANY": 'dashboard:settings.company',
  "DASHBOARD_SETTINGS.NETWORK": 'dashboard:settings.network',
  "DASHBOARD_SETTINGS.RADIUS": 'dashboard:settings.radius',
  "DASHBOARD_SETTINGS.MIKROTIK": 'dashboard:settings.mikrotik',
  "DASHBOARD_SETTINGS.OPENVPN": 'dashboard:settings.openvpn',
  "DASHBOARD_SETTINGS.EMAIL": 'dashboard:settings.email',
  "DASHBOARD_SETTINGS.SMS": 'dashboard:settings.sms',
  "DASHBOARD_SETTINGS.BACKUP": 'dashboard:settings.backup',
  "DASHBOARD_SETTINGS.INTEGRATIONS": 'dashboard:settings.integrations',
  "DASHBOARD_TOOLS.PING": 'dashboard:tools.ping',
  "DASHBOARD_TOOLS.TRACEROUTE": 'dashboard:tools.traceroute',
  "DASHBOARD_TOOLS.BANDWIDTH_TEST": 'dashboard:tools.bandwidth_test',
  "DASHBOARD_TOOLS.USER_LOOKUP": 'dashboard:tools.user_lookup',
  "DASHBOARD_TOOLS.SESSION_MANAGER": 'dashboard:tools.session_manager',
  "DASHBOARD_TOOLS.BULK_ACTIONS": 'dashboard:tools.bulk_actions',
  "DASHBOARD_MONITORING.SYSTEM": 'dashboard:monitoring.system',
  "DASHBOARD_MONITORING.SERVICES": 'dashboard:monitoring.services',
  "DASHBOARD_MONITORING.LOGS": 'dashboard:monitoring.logs',
  "DASHBOARD_MONITORING.ALERTS": 'dashboard:monitoring.alerts',
  "DASHBOARD_MONITORING.PERFORMANCE": 'dashboard:monitoring.performance',
  "DASHBOARD_MOBILE.DASHBOARD": 'dashboard:mobile.dashboard',
  "DASHBOARD_MOBILE.TICKETS": 'dashboard:mobile.tickets',
  "DASHBOARD_MOBILE.INSTALLATIONS": 'dashboard:mobile.installations',
  "DASHBOARD_MOBILE.CUSTOMER_LOOKUP": 'dashboard:mobile.customer_lookup',
  "DASHBOARD_PORTAL.DASHBOARD": 'dashboard:portal.dashboard',
  "DASHBOARD_PORTAL.USAGE": 'dashboard:portal.usage',
  "DASHBOARD_PORTAL.BILLING": 'dashboard:portal.billing',
  "DASHBOARD_PORTAL.SUPPORT": 'dashboard:portal.support',
  "DASHBOARD_PORTAL.PROFILE": 'dashboard:portal.profile',
  "DASHBOARD_API.CUSTOMERS.SEARCH": 'dashboard:api.customers.search',
  "DASHBOARD_API.USAGE.STATS": 'dashboard:api.usage.stats',
  "DASHBOARD_API.NETWORK.STATUS": 'dashboard:api.network.status',
  "DASHBOARD_API.TICKETS.ASSIGN": 'dashboard:api.tickets.assign',
  "DASHBOARD_API.USERS.ACTIONS": 'dashboard:api.users.actions',
  API_CUSTOMER_LIST: 'api:customer-list',
  API_CUSTOMER_DEFAULT: 'api:customer-default',
  API_CUSTOMER_DETAIL: 'api:customer-detail',
  API_USERS_LIST: 'api:users-list',
  API_USERS_ME: 'api:users-me',
  API_USERS_UPDATE_ME: 'api:users-update-me',
  API_USERS_DETAIL: 'api:users-detail',
  API_PACKAGE_LIST: 'api:package-list',
  API_PACKAGE_DEFAULT: 'api:package-default',
  API_PACKAGE_DETAIL: 'api:package-detail',
  API_SUBSCRIPTION_LIST: 'api:subscription-list',
  API_SUBSCRIPTION_DETAIL: 'api:subscription-detail',
  API_TICKET_LIST: 'api:ticket-list',
  API_TICKET_DETAIL: 'api:ticket-detail',
  API_EQUIPMENT_LIST: 'api:equipment-list',
  API_EQUIPMENT_DEFAULT: 'api:equipment-default',
  API_EQUIPMENT_PROVISION: 'api:equipment-provision',
  API_EQUIPMENT_DETAIL: 'api:equipment-detail',
  API_INVOICE_LIST: 'api:invoice-list',
  API_INVOICE_DETAIL: 'api:invoice-detail',
  API_PAYMENT_LIST: 'api:payment-list',
  API_PAYMENT_DETAIL: 'api:payment-detail',
  API_API_ROOT: 'api:api-root',
  API_TOKEN_OBTAIN_PAIR: 'api:token_obtain_pair',
  API_TOKEN_REFRESH: 'api:token_refresh',
  API_TOKEN_VERIFY: 'api:token_verify',
  API_DASHBOARD_STATS: 'api:dashboard_stats',
  API_USAGE_STATS: 'api:usage_stats',
  API_REVENUE_STATS: 'api:revenue_stats',
  API_ACTIVE_SESSIONS: 'api:active_sessions',
  API_BANDWIDTH_USAGE: 'api:bandwidth_usage',
  API_SYSTEM_ALERTS: 'api:system_alerts',
  API_RADIUS_INTEGRATION: 'api:radius_integration',
  API_MIKROTIK_INTEGRATION: 'api:mikrotik_integration',
  API_WEBHOOK: 'api:webhook',
  API_BULK_CUSTOMERS: 'api:bulk_customers',
  API_BULK_SUBSCRIPTIONS: 'api:bulk_subscriptions',
  API_EXPORT_CUSTOMERS: 'api:export_customers',
  API_EXPORT_USAGE: 'api:export_usage',
  API_EXPORT_INVOICES: 'api:export_invoices',
  API_EQUIPMENT_AUTHORIZE: 'api:equipment_authorize',
  API_EQUIPMENT_CERT: 'api:equipment_cert',
  API_EQUIPMENT_CONFIG: 'api:equipment_config',
  API_HOTSPOT_FILE: 'api:hotspot_file',
  AUTH_LOGIN: 'auth:login',
  AUTH_LOGOUT: 'auth:logout',
  AUTH_REGISTER: 'auth:register',
  AUTH_COMPANY_SETUP: 'auth:company_setup',
  AUTH_PASSWORD_RESET: 'auth:password_reset',
  AUTH_PASSWORD_RESET_CONFIRM: 'auth:password_reset_confirm',
  AUTH_PROFILE: 'auth:profile',
  AUTH_CHANGE_PASSWORD: 'auth:change_password',
  LANDING_INDEX: 'landing:index',
  LANDING_ABOUT: 'landing:about',
  LANDING_SERVICES: 'landing:services',
  LANDING_PACKAGES: 'landing:packages',
  LANDING_CONTACT: 'landing:contact',
  LANDING_SUPPORT: 'landing:support',
  LANDING_TERMS: 'landing:terms',
  LANDING_PRIVACY: 'landing:privacy'
} as const;

export type RouteName = keyof typeof ROUTES;
