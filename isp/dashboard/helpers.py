"""
ISP Management System - Inertia.js Helpers
Utility functions and patterns for Inertia.js views
File: dashboard/helpers.py
"""

from django.urls import reverse
from django.core.paginator import Paginator
from django.db.models import Q, Count, Sum, Avg
from django.utils import timezone
from datetime import datetime, timedelta
import json
from typing import Dict, List, Any, Optional


# =============================================================================
# INERTIA VIEW HELPERS
# =============================================================================

def paginate_for_inertia(queryset, request, per_page=20):
    """
    Paginate queryset for Inertia.js with search and filtering
    """
    page = request.GET.get('page', 1)
    search = request.GET.get('search', '')

    paginator = Paginator(queryset, per_page)
    page_obj = paginator.get_page(page)

    return {
        'data': [item.to_dict() if hasattr(item, 'to_dict') else model_to_dict(item) for item in page_obj],
        'pagination': {
            'current_page': page_obj.number,
            'last_page': paginator.num_pages,
            'per_page': per_page,
            'total': paginator.count,
            'has_previous': page_obj.has_previous(),
            'has_next': page_obj.has_next(),
            'previous_page_number': page_obj.previous_page_number() if page_obj.has_previous() else None,
            'next_page_number': page_obj.next_page_number() if page_obj.has_next() else None,
        },
        'filters': {
            'search': search,
        }
    }


def get_breadcrumbs(route_name: str, **kwargs) -> List[Dict[str, str]]:
    """
    Generate breadcrumbs for navigation
    """
    breadcrumbs_map = {
        'dashboard:overview': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')}
        ],
        'dashboard:customers.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Customers', 'url': reverse('dashboard:customers.index')}
        ],
        'dashboard:customers.show': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Customers', 'url': reverse('dashboard:customers.index')},
            {'label': 'Customer Details', 'url': '#'}
        ],
        'dashboard:packages.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Packages', 'url': reverse('dashboard:packages.index')}
        ],
        'dashboard:subscriptions.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Subscriptions', 'url': reverse('dashboard:subscriptions.index')}
        ],
        'dashboard:tickets.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Support Tickets', 'url': reverse('dashboard:tickets.index')}
        ],
        'dashboard:billing.overview': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Billing', 'url': reverse('dashboard:billing.overview')}
        ],
        'dashboard:network.overview': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Network', 'url': reverse('dashboard:network.overview')}
        ],
        'dashboard:team.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Team', 'url': reverse('dashboard:team.index')}
        ],
        'dashboard:reports.index': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Reports', 'url': reverse('dashboard:reports.index')}
        ],
        'dashboard:settings.general': [
            {'label': 'Dashboard', 'url': reverse('dashboard:overview')},
            {'label': 'Settings', 'url': '#'}
        ],
    }

    return breadcrumbs_map.get(route_name, [
        {'label': 'Dashboard', 'url': reverse('dashboard:overview')}
    ])


def get_sidebar_menu(request) -> List[Dict[str, Any]]:
    """
    Generate sidebar menu items based on user permissions
    """
    user = request.user

    menu_items = [
        {
            'label': 'Dashboard',
            'icon': 'dashboard',
            'route': 'dashboard:overview',
            'active': request.resolver_match.url_name == 'overview'
        },
        {
            'label': 'Customers',
            'icon': 'users',
            'route': 'dashboard:customers.index',
            'active': 'customers' in request.resolver_match.url_name,
            'badge': get_pending_customers_count() if user.has_perm('customers.view_customer') else None
        },
        {
            'label': 'Packages',
            'icon': 'package',
            'route': 'dashboard:packages.index',
            'active': 'packages' in request.resolver_match.url_name
        },
        {
            'label': 'Subscriptions',
            'icon': 'subscription',
            'route': 'dashboard:subscriptions.index',
            'active': 'subscriptions' in request.resolver_match.url_name
        },
        {
            'label': 'Network',
            'icon': 'network',
            'route': 'dashboard:network.overview',
            'active': 'network' in request.resolver_match.url_name,
            'children': [
                {'label': 'Overview', 'route': 'dashboard:network.overview'},
                {'label': 'Devices', 'route': 'dashboard:network.devices'},
                {'label': 'Monitoring', 'route': 'dashboard:network.monitoring'},
                {'label': 'Bandwidth', 'route': 'dashboard:network.bandwidth'},
            ]
        },
        {
            'label': 'Support',
            'icon': 'support',
            'route': 'dashboard:tickets.index',
            'active': 'tickets' in request.resolver_match.url_name,
            'badge': get_open_tickets_count() if user.has_perm('tickets.view_ticket') else None
        },
        {
            'label': 'Billing',
            'icon': 'billing',
            'route': 'dashboard:billing.overview',
            'active': 'billing' in request.resolver_match.url_name,
            'children': [
                {'label': 'Overview', 'route': 'dashboard:billing.overview'},
                {'label': 'Invoices', 'route': 'dashboard:billing.invoices'},
                {'label': 'Payments', 'route': 'dashboard:billing.payments'},
                {'label': 'Overdue', 'route': 'dashboard:billing.overdue'},
            ]
        },
        {
            'label': 'Usage & Analytics',
            'icon': 'analytics',
            'route': 'dashboard:usage.overview',
            'active': 'usage' in request.resolver_match.url_name,
            'children': [
                {'label': 'Overview', 'route': 'dashboard:usage.overview'},
                {'label': 'Sessions', 'route': 'dashboard:usage.sessions'},
                {'label': 'Bandwidth', 'route': 'dashboard:usage.bandwidth'},
                {'label': 'Reports', 'route': 'dashboard:usage.reports'},
            ]
        },
        {
            'label': 'Team',
            'icon': 'team',
            'route': 'dashboard:team.index',
            'active': 'team' in request.resolver_match.url_name
        },
        {
            'label': 'Reports',
            'icon': 'reports',
            'route': 'dashboard:reports.index',
            'active': 'reports' in request.resolver_match.url_name
        },
        {
            'label': 'Tools',
            'icon': 'tools',
            'route': 'dashboard:tools.ping',
            'active': 'tools' in request.resolver_match.url_name,
            'children': [
                {'label': 'Ping Tool', 'route': 'dashboard:tools.ping'},
                {'label': 'User Lookup', 'route': 'dashboard:tools.user_lookup'},
                {'label': 'Session Manager', 'route': 'dashboard:tools.session_manager'},
                {'label': 'Bulk Actions', 'route': 'dashboard:tools.bulk_actions'},
            ]
        },
        {
            'label': 'Settings',
            'icon': 'settings',
            'route': 'dashboard:settings.general',
            'active': 'settings' in request.resolver_match.url_name,
            'children': [
                {'label': 'General', 'route': 'dashboard:settings.general'},
                {'label': 'Company', 'route': 'dashboard:settings.company'},
                {'label': 'Network', 'route': 'dashboard:settings.network'},
                {'label': 'Integrations', 'route': 'dashboard:settings.integrations'},
            ]
        },
    ]

    # Filter menu items based on user permissions
    filtered_menu = []
    for item in menu_items:
        if user.is_superuser or has_menu_permission(user, item):
            filtered_menu.append(item)

    return filtered_menu


def get_dashboard_stats() -> Dict[str, Any]:
    """
    Get key statistics for dashboard overview
    """
    from isp.models import Customer, Subscription, Ticket, Invoice

    today = timezone.now().date()
    thirty_days_ago = today - timedelta(days=30)

    return {
        'customers': {
            'total': Customer.objects.count(),
            'active': Customer.objects.filter(status='active').count(),
            'new_this_month': Customer.objects.filter(created_at__gte=thirty_days_ago).count(),
        },
        'subscriptions': {
            'total': Subscription.objects.count(),
            'active': Subscription.objects.filter(status='active').count(),
            'revenue_this_month': Subscription.objects.filter(
                status='active',
                created_at__gte=thirty_days_ago
            ).aggregate(total=Sum('monthly_fee'))['total'] or 0,
        },
        'tickets': {
            'total': Ticket.objects.count(),
            'open': Ticket.objects.filter(status__in=['open', 'in_progress']).count(),
            'resolved_this_month': Ticket.objects.filter(
                status='resolved',
                resolution_date__gte=thirty_days_ago
            ).count(),
        },
        'billing': {
            'total_revenue': Invoice.objects.filter(status='paid').aggregate(
                total=Sum('total_amount')
            )['total'] or 0,
            'pending_invoices': Invoice.objects.filter(status='sent').count(),
            'overdue_invoices': Invoice.objects.filter(
                status='sent',
                due_date__lt=today
            ).count(),
        }
    }


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def model_to_dict(instance, fields=None, exclude=None):
    """
    Convert Django model instance to dictionary for JSON serialization
    """
    from django.forms.models import model_to_dict as django_model_to_dict

    data = django_model_to_dict(instance, fields=fields, exclude=exclude)

    # Handle datetime fields
    for field_name, field_value in data.items():
        if isinstance(field_value, (datetime, timezone.datetime)):
            data[field_name] = field_value.isoformat()
        elif hasattr(field_value, 'url'):  # File/Image fields
            data[field_name] = field_value.url if field_value else None

    return data


def search_customers(search_term: str):
    """
    Search customers by various criteria
    """
    from isp.models import Customer

    if not search_term:
        return Customer.objects.all()

    return Customer.objects.filter(
        Q(customer_id__icontains=search_term) |
        Q(user__first_name__icontains=search_term) |
        Q(user__last_name__icontains=search_term) |
        Q(user__email__icontains=search_term) |
        Q(primary_phone__icontains=search_term) |
        Q(business_name__icontains=search_term)
    )


def get_pending_customers_count():
    """Get count of customers pending activation"""
    from isp.models import Customer
    return Customer.objects.filter(status='lead').count()


def get_open_tickets_count():
    """Get count of open support tickets"""
    from isp.models import Ticket
    return Ticket.objects.filter(status__in=['open', 'in_progress']).count()


def has_menu_permission(user, menu_item):
    """
    Check if user has permission to see menu item
    """
    # Implement your permission logic here
    permission_map = {
        'customers': 'customers.view_customer',
        'packages': 'packages.view_package',
        'subscriptions': 'subscriptions.view_subscription',
        'network': 'network.view_network',
        'tickets': 'tickets.view_ticket',
        'billing': 'billing.view_invoice',
        'usage': 'usage.view_usage',
        'team': 'team.view_user',
        'reports': 'reports.view_reports',
        'tools': 'tools.use_tools',
        'settings': 'settings.change_settings',
    }

    required_permission = permission_map.get(menu_item['label'].lower())
    if required_permission:
        return user.has_perm(required_permission)

    return True  # Default allow


def format_currency(amount, currency='USD'):
    """Format currency for display"""
    if currency == 'KES':
        return f"KSh {amount:,.2f}"
    elif currency == 'USD':
        return f"${amount:,.2f}"
    else:
        return f"{currency} {amount:,.2f}"


def format_bytes(bytes_value):
    """Format bytes to human readable format"""
    if bytes_value == 0:
        return "0 B"

    size_units = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    while bytes_value >= 1024 and i < len(size_units) - 1:
        bytes_value /= 1024.0
        i += 1

    return f"{bytes_value:.2f} {size_units[i]}"


def get_usage_chart_data(subscription_id: int, days: int = 7):
    """Get usage data for charts"""
    from isp.models import UsageLog

    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)

    usage_logs = UsageLog.objects.filter(
        subscription_id=subscription_id,
        start_time__gte=start_date,
        start_time__lte=end_date
    ).values('start_time__date').annotate(
        total_bytes=Sum('input_octets') + Sum('output_octets'),
        session_count=Count('id')
    ).order_by('start_time__date')

    chart_data = []
    for log in usage_logs:
        chart_data.append({
            'date': log['start_time__date'].isoformat(),
            'usage_mb': round(log['total_bytes'] / (1024 * 1024), 2),
            'sessions': log['session_count']
        })

    return chart_data


# =============================================================================
# INERTIA RESPONSE HELPERS
# =============================================================================

def inertia_response_data(request, additional_data=None):
    """
    Common data to include in all Inertia responses
    """
    base_data = {
        'auth': {
            'user': {
                'id': request.user.id,
                'name': request.user.get_full_name(),
                'email': request.user.email,
                'avatar': request.user.profile.avatar.url if hasattr(request.user,
                                                                     'profile') and request.user.profile.avatar else None,
                'permissions': list(request.user.get_all_permissions()),
                'is_superuser': request.user.is_superuser,
            }
        },
        'navigation': {
            'sidebar': get_sidebar_menu(request),
            'breadcrumbs': [],  # Will be set in individual views
        },
        'flash': {
            'success': request.session.pop('success_message', None),
            'error': request.session.pop('error_message', None),
            'warning': request.session.pop('warning_message', None),
            'info': request.session.pop('info_message', None),
        },
        'config': {
            'app_name': 'ISP Management System',
            'company_name': getattr(request.user, 'company', {}).get('name', 'Your ISP'),
            'timezone': 'UTC',  # Get from user/company settings
            'currency': 'USD',  # Get from user/company settings
        }
    }

    if additional_data:
        base_data.update(additional_data)

    return base_data


# =============================================================================
# EXAMPLE USAGE IN VIEWS
# =============================================================================

"""
Example of how to use these helpers in your views:

@login_required
@inertia("customers/index")
def customers_list(request):
    # Search and filter customers
    search = request.GET.get('search', '')
    status_filter = request.GET.get('status', '')

    customers = search_customers(search)
    if status_filter:
        customers = customers.filter(status=status_filter)

    # Paginate results
    paginated_customers = paginate_for_inertia(customers, request, per_page=20)

    # Get additional data
    stats = {
        'total_customers': Customer.objects.count(),
        'active_customers': Customer.objects.filter(status='active').count(),
        'pending_customers': get_pending_customers_count(),
    }

    return inertia_response_data(request, {
        'customers': paginated_customers,
        'stats': stats,
        'filters': {
            'search': search,
            'status': status_filter,
            'status_options': [
                {'value': '', 'label': 'All Customers'},
                {'value': 'active', 'label': 'Active'},
                {'value': 'suspended', 'label': 'Suspended'},
                {'value': 'lead', 'label': 'Leads'},
            ]
        },
        'navigation': {
            'breadcrumbs': get_breadcrumbs('dashboard:customers.index')
        }
    })

@login_required
@inertia("customers/show")
def customer_detail(request, customer_id):
    customer = get_object_or_404(Customer, id=customer_id)

    # Get related data
    subscriptions = customer.subscriptions.all()
    recent_tickets = customer.tickets.order_by('-created_at')[:5]
    usage_data = get_usage_chart_data(subscriptions.first().id if subscriptions else None)

    return inertia_response_data(request, {
        'customer': model_to_dict(customer),
        'subscriptions': [model_to_dict(sub) for sub in subscriptions],
        'recent_tickets': [model_to_dict(ticket) for ticket in recent_tickets],
        'usage_chart_data': usage_data,
        'navigation': {
            'breadcrumbs': get_breadcrumbs('dashboard:customers.show')
        }
    })
"""
