"""
ISP Management System - Django Admin Configuration
Comprehensive admin interface for ISP management
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.urls import reverse
from django.utils.safestring import mark_safe
from django.db.models import Count, Sum
from django.utils import timezone
from datetime import datetime, timedelta

from .models import (
    # Base Models
    Company, User, UserProfile, Skill, Certification,

    # Customer Management
    Customer,

    # Package Management
    PackageCategory, InternetPackage, Subscription,

    # Network Infrastructure
    NetworkZone, NetworkEquipment, IPAddressPool, IPAddress,

    # Ticketing System
    TicketCategory, Ticket, TicketComment,

    # Billing & Payments
    Invoice, InvoiceItem, Payment,

    # Usage Tracking
    UsageLog, BandwidthLog,

    # Notifications
    NotificationTemplate, Notification,

    # System Logs
    SystemLog
)


# ============================================================================
# ADMIN MIXINS AND UTILITIES
# ============================================================================

class ReadOnlyAdminMixin:
    """Mixin for read-only admin interfaces"""

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class CompanyFilterMixin:
    """Mixin to filter objects by company"""

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if hasattr(self.model, 'company') and not request.user.is_superuser:
            if hasattr(request.user, 'company') and request.user.company:
                return qs.filter(company=request.user.company)
        return qs


# ============================================================================
# BASE MODEL ADMINS
# ============================================================================

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'phone', 'is_active', 'created_at']
    list_filter = ['is_active', 'currency', 'created_at']
    search_fields = ['name', 'email', 'phone',]
    prepopulated_fields = {'slug': ('name',)}
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'logo', 'email', 'phone', 'website')
        }),
        ('Address', {
            'fields': ('address',)
        }),
        ('Business Details', {
            'fields': ('is_active',)
        }),
        ('Settings', {
            'fields': ('currency', 'timezone'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['created_at', 'updated_at']


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    extra = 0
    fieldsets = (
        ('Personal Information', {
            'fields': ('bio', 'date_of_birth', 'address')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact', 'emergency_phone')
        }),
        ('Professional', {
            'fields': ('skills', 'certifications')
        }),
    )


@admin.register(User)
class UserAdmin(BaseUserAdmin, CompanyFilterMixin):
    list_display = ['username', 'get_full_name', 'email', 'user_type', 'company', 'is_active', 'last_login']
    list_filter = ['user_type', 'company', 'is_active', 'is_verified', 'two_factor_enabled', 'date_joined']
    search_fields = ['username', 'first_name', 'last_name', 'email', 'employee_id']
    ordering = ['-date_joined']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('ISP Information', {
            'fields': ('company', 'user_type', 'phone', 'avatar', 'is_verified', 'two_factor_enabled')
        }),
        ('Employee Details', {
            'fields': ('employee_id', 'department', 'hire_date', 'salary'),
            'classes': ('collapse',)
        }),
        ('Security', {
            'fields': ('last_login_ip',),
            'classes': ('collapse',)
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('ISP Information', {
            'fields': ('company', 'user_type', 'phone', 'email')
        }),
    )

    inlines = [UserProfileInline]

    def get_full_name(self, obj):
        return obj.get_full_name()

    get_full_name.short_description = 'Full Name'


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'description']
    list_filter = ['category']
    search_fields = ['name', 'description']


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ['name', 'issuing_organization', 'issue_date', 'expiry_date', 'is_expired']
    list_filter = ['issuing_organization', 'issue_date', 'expiry_date']
    search_fields = ['name', 'issuing_organization', 'certificate_id']

    def is_expired(self, obj):
        if obj.expiry_date:
            return timezone.now().date() > obj.expiry_date
        return False

    is_expired.boolean = True
    is_expired.short_description = 'Expired'


# ============================================================================
# CUSTOMER MANAGEMENT ADMINS
# ============================================================================

@admin.register(Customer)
class CustomerAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = [
        'get_customer_name', 'customer_type', 'status',
        'primary_phone', 'city', 'current_balance', 'activation_date'
    ]
    list_filter = [
        'status', 'customer_type', 'company', 'city', 'state',
        'activation_date', 'created_at'
    ]
    search_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'primary_phone', 'business_name'
    ]
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'company', 'customer_type', 'status')
        }),
        ('Contact Information', {
            'fields': (
                'primary_phone', 'secondary_phone',
                'primary_email', 'secondary_email'
            )
        }),
        ('Address Information', {
            'fields': (
                'installation_address', 'billing_address',
                'city', 'state', 'postal_code', 'country'
            )
        }),
        ('Business Information', {
            'fields': ('business_name',),
            'classes': ('collapse',)
        }),
        ('Service Information', {
            'fields': (
                'activation_date', 'termination_date',
                'credit_limit', 'current_balance'
            )
        }),
        ('Preferences', {
            'fields': (
                 'auto_pay_enabled',
                'email_notifications', 'sms_notifications'
            ),
            'classes': ('collapse',)
        }),
    )

    def get_customer_name(self, obj):
        return obj.user.get_full_name()

    get_customer_name.short_description = 'Customer Name'
    get_customer_name.admin_order_field = 'user__first_name'

    actions = ['activate_customers', 'suspend_customers']

    def activate_customers(self, request, queryset):
        updated = queryset.update(status='active', activation_date=timezone.now())
        self.message_user(request, f'{updated} customers activated.')

    activate_customers.short_description = "Activate selected customers"

    def suspend_customers(self, request, queryset):
        updated = queryset.update(status='suspended')
        self.message_user(request, f'{updated} customers suspended.')

    suspend_customers.short_description = "Suspend selected customers"


# ============================================================================
# PACKAGE MANAGEMENT ADMINS
# ============================================================================

@admin.register(PackageCategory)
class PackageCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'order']
    list_editable = ['order']
    ordering = ['order', 'name']


@admin.register(InternetPackage)
class InternetPackageAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = [
        'name', 'package_type', 'download_speed', 'upload_speed',
        'price', 'is_active', 'is_featured', 'current_subscribers', 'max_subscribers'
    ]
    list_filter = [
        'package_type', 'billing_type', 'is_active', 'is_featured',
        'company', 'category'
    ]
    search_fields = ['name', 'description']
    list_editable = ['is_active', 'is_featured']

    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'category', 'name', 'description', 'package_type', 'billing_type')
        }),
        ('Technical Specifications', {
            'fields': (
                'download_speed', 'upload_speed', 'data_limit', 'time_limit',
                'priority_level', 'burst_speed', 'fair_usage_policy'
            )
        }),
        ('Pricing', {
            'fields': ('price', 'setup_fee', 'currency')
        }),
        ('Availability', {
            'fields': ('is_active', 'is_featured', 'max_subscribers', 'current_subscribers')
        }),
        ('SLA', {
            'fields': ('uptime_guarantee', 'support_hours'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['current_subscribers']


class SubscriptionUsageInline(admin.TabularInline):
    model = UsageLog
    extra = 0
    readonly_fields = ['session_start', 'session_end', 'bytes_uploaded', 'bytes_downloaded', 'total_bytes']
    fields = ['session_start', 'session_end', 'bytes_uploaded', 'bytes_downloaded', 'total_bytes']
    max_num = 10

    def total_bytes(self, obj):
        return f"{obj.total_bytes:,} bytes"

    total_bytes.short_description = 'Total Bytes'


@admin.register(Subscription)
class SubscriptionAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = [
        'subscription_id', 'get_customer_name', 'package', 'status',
        'start_date', 'next_billing_date', 'monthly_fee', 'assigned_ip'
    ]
    list_filter = [
        'status', 'package__package_type', 'start_date',
        'next_billing_date', 'installation_date'
    ]
    search_fields = [
        'subscription_id', 'customer__user__first_name',
        'customer__user__last_name', 'customer__customer_id',
        'assigned_ip', 'username'
    ]
    readonly_fields = ['subscription_id', 'data_usage_percentage', 'is_expired']

    fieldsets = (
        ('Subscription Details', {
            'fields': ('subscription_id', 'customer', 'package', 'status')
        }),
        ('Dates', {
            'fields': ('start_date', 'end_date', 'next_billing_date', 'last_billing_date')
        }),
        ('Usage Tracking', {
            'fields': ('data_used', 'time_used', 'data_usage_percentage', 'is_expired')
        }),
        ('Network Configuration', {
            'fields': ('assigned_ip', 'mac_address', 'username', 'password')
        }),
        ('Billing', {
            'fields': ('monthly_fee', 'setup_fee_paid', 'total_paid')
        }),
        ('Installation', {
            'fields': ('installation_date', 'installation_technician', 'installation_notes'),
            'classes': ('collapse',)
        }),
    )

    inlines = [SubscriptionUsageInline]

    def get_customer_name(self, obj):
        return obj.customer.user.get_full_name()

    get_customer_name.short_description = 'Customer'
    get_customer_name.admin_order_field = 'customer__user__first_name'


# ============================================================================
# NETWORK INFRASTRUCTURE ADMINS
# ============================================================================

@admin.register(NetworkZone)
class NetworkZoneAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = ['name', 'company', 'coverage_area', 'is_active', 'created_at']
    list_filter = ['company', 'is_active', 'created_at']
    search_fields = ['name', 'coverage_area', 'description']


@admin.register(NetworkEquipment)
class NetworkEquipmentAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = [
        'name', 'equipment_type', 'brand', 'model', 'status',
        'zone', 'ip_address', 'warranty_status'
    ]
    list_filter = [
        'equipment_type', 'status', 'brand', 'zone',
        'purchase_date', 'warranty_expiry'
    ]
    search_fields = [
        'name', 'brand', 'model', 'serial_number',
        'mac_address', 'ip_address'
    ]

    fieldsets = (
        ('Basic Information', {
            'fields': ('company', 'zone', 'name', 'equipment_type', 'brand', 'model', 'serial_number')
        }),
        ('Technical Specifications', {
            'fields': ('mac_address', 'ip_address', 'firmware_version', 'port_count')
        }),
        ('Status and Location', {
            'fields': ('status', 'location', 'coordinates')
        }),
        ('Financial Information', {
            'fields': ('purchase_date', 'purchase_price', 'warranty_expiry', 'vendor'),
            'classes': ('collapse',)
        }),
        ('Maintenance', {
            'fields': ('last_maintenance', 'next_maintenance', 'maintenance_notes'),
            'classes': ('collapse',)
        }),
    )

    def warranty_status(self, obj):
        if obj.warranty_expiry:
            if timezone.now().date() > obj.warranty_expiry:
                return format_html('<span style="color: red;">Expired</span>')
            elif (obj.warranty_expiry - timezone.now().date()).days < 30:
                return format_html('<span style="color: orange;">Expiring Soon</span>')
            else:
                return format_html('<span style="color: green;">Valid</span>')
        return 'N/A'

    warranty_status.short_description = 'Warranty Status'


class IPAddressInline(admin.TabularInline):
    model = IPAddress
    extra = 0
    fields = ['ip_address', 'status', 'assigned_to', 'assigned_date', 'notes']
    readonly_fields = ['assigned_date']


@admin.register(IPAddressPool)
class IPAddressPoolAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = ['name', 'network', 'pool_type', 'company', 'is_active', 'available_ips']
    list_filter = ['pool_type', 'company', 'is_active']
    search_fields = ['name', 'network', 'description']

    inlines = [IPAddressInline]

    def available_ips(self, obj):
        total = obj.ip_addresses.count()
        available = obj.ip_addresses.filter(status='available').count()
        return f"{available}/{total}"

    available_ips.short_description = 'Available IPs'


@admin.register(IPAddress)
class IPAddressAdmin(admin.ModelAdmin):
    list_display = ['ip_address', 'pool', 'status', 'assigned_to', 'assigned_date']
    list_filter = ['status', 'pool__pool_type', 'pool__company', 'assigned_date']
    search_fields = ['ip_address', 'notes', 'assigned_to__subscription_id']
    readonly_fields = ['assigned_date']


# ============================================================================
# TICKETING SYSTEM ADMINS
# ============================================================================

@admin.register(TicketCategory)
class TicketCategoryAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'default_priority', 'sla_response_hours',
        'sla_resolution_hours', 'description'
    ]
    list_editable = ['default_priority', 'sla_response_hours', 'sla_resolution_hours']


class TicketCommentInline(admin.StackedInline):
    model = TicketComment
    extra = 0
    fields = ['author', 'comment', 'is_internal', 'attachments', 'created_at']
    readonly_fields = ['created_at']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = [
        'ticket_id', 'subject', 'customer', 'ticket_type', 'priority',
        'status', 'assigned_to', 'created_at', 'sla_status'
    ]
    list_filter = [
        'ticket_type', 'priority', 'status', 'category',
        'assigned_to', 'created_at'
    ]
    search_fields = [
        'ticket_id', 'subject', 'description',
        'customer__user__first_name', 'customer__user__last_name'
    ]
    readonly_fields = ['ticket_id', 'sla_status', 'is_overdue']

    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_id', 'customer', 'category', 'subject', 'description')
        }),
        ('Classification', {
            'fields': ('ticket_type', 'priority', 'status')
        }),
        ('Assignment', {
            'fields': ('assigned_to', 'assigned_date')
        }),
        ('SLA Tracking', {
            'fields': (
                'sla_response_due', 'sla_resolution_due',
                'first_response_date', 'resolution_date',
                'sla_status', 'is_overdue'
            ),
            'classes': ('collapse',)
        }),
        ('Customer Feedback', {
            'fields': ('satisfaction_rating', 'satisfaction_comment'),
            'classes': ('collapse',)
        }),
    )

    inlines = [TicketCommentInline]

    def sla_status(self, obj):
        if obj.is_overdue:
            return format_html('<span style="color: red; font-weight: bold;">OVERDUE</span>')
        elif obj.sla_resolution_due:
            time_left = obj.sla_resolution_due - timezone.now()
            if time_left.total_seconds() < 3600:  # Less than 1 hour
                return format_html('<span style="color: orange;">Due Soon</span>')
            else:
                return format_html('<span style="color: green;">On Track</span>')
        return 'N/A'

    sla_status.short_description = 'SLA Status'

    actions = ['assign_to_me', 'mark_in_progress', 'mark_resolved']

    def assign_to_me(self, request, queryset):
        updated = queryset.update(assigned_to=request.user, assigned_date=timezone.now())
        self.message_user(request, f'{updated} tickets assigned to you.')

    assign_to_me.short_description = "Assign selected tickets to me"

    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} tickets marked as in progress.')

    mark_in_progress.short_description = "Mark as in progress"

    def mark_resolved(self, request, queryset):
        updated = queryset.update(status='resolved', resolution_date=timezone.now())
        self.message_user(request, f'{updated} tickets marked as resolved.')

    mark_resolved.short_description = "Mark as resolved"


# ============================================================================
# BILLING & PAYMENTS ADMINS
# ============================================================================

class InvoiceItemInline(admin.TabularInline):
    model = InvoiceItem
    extra = 0
    fields = ['description', 'quantity', 'unit_price', 'total_price']
    readonly_fields = ['total_price']


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = [
        'invoice_number', 'customer', 'issue_date', 'due_date',
        'total_amount', 'paid_amount', 'status', 'balance_due'
    ]
    list_filter = ['status', 'issue_date', 'due_date', 'paid_date']
    search_fields = [
        'invoice_number', 'customer__user__first_name',
        'customer__user__last_name', 'customer__customer_id'
    ]
    readonly_fields = ['invoice_number', 'balance_due', 'is_overdue']

    fieldsets = (
        ('Invoice Details', {
            'fields': ('invoice_number', 'customer', 'subscription', 'status')
        }),
        ('Dates', {
            'fields': ('issue_date', 'due_date', 'paid_date', 'is_overdue')
        }),
        ('Amounts', {
            'fields': (
                'subtotal', 'tax_rate', 'tax_amount',
                'total_amount', 'paid_amount', 'balance_due'
            )
        }),
        ('Additional Information', {
            'fields': ('notes', 'terms'),
            'classes': ('collapse',)
        }),
    )

    inlines = [InvoiceItemInline]

    actions = ['mark_as_paid', 'send_reminder']

    def mark_as_paid(self, request, queryset):
        updated = queryset.update(
            status='paid',
            paid_date=timezone.now().date(),
            paid_amount=models.F('total_amount')
        )
        self.message_user(request, f'{updated} invoices marked as paid.')

    mark_as_paid.short_description = "Mark as paid"


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'payment_id', 'customer', 'amount', 'payment_method',
        'status', 'payment_date', 'processed_by'
    ]
    list_filter = ['payment_method', 'status', 'payment_date', 'processed_by']
    search_fields = [
        'payment_id', 'transaction_reference', 'receipt_number',
        'customer__user__first_name', 'customer__user__last_name'
    ]
    readonly_fields = ['payment_id']

    fieldsets = (
        ('Payment Details', {
            'fields': ('payment_id', 'customer', 'invoice', 'amount', 'payment_method', 'status')
        }),
        ('Transaction Details', {
            'fields': ('transaction_reference', 'payment_date', 'processed_by', 'receipt_number')
        }),
        ('Additional Information', {
            'fields': ('notes',),
            'classes': ('collapse',)
        }),
    )


# ============================================================================
# USAGE TRACKING ADMINS
# ============================================================================

@admin.register(UsageLog)
class UsageLogAdmin(ReadOnlyAdminMixin, admin.ModelAdmin):
    list_display = [
        'subscription', 'session_start', 'session_end',
        'bytes_uploaded_mb', 'bytes_downloaded_mb', 'total_mb', 'ip_address'
    ]
    list_filter = ['session_start', 'session_end', 'ip_address']
    search_fields = [
        'subscription__subscription_id', 'ip_address',
        'mac_address', 'session_id'
    ]
    date_hierarchy = 'session_start'

    def bytes_uploaded_mb(self, obj):
        return f"{obj.bytes_uploaded / (1024 * 1024):.2f} MB"

    bytes_uploaded_mb.short_description = 'Upload (MB)'

    def bytes_downloaded_mb(self, obj):
        return f"{obj.bytes_downloaded / (1024 * 1024):.2f} MB"

    bytes_downloaded_mb.short_description = 'Download (MB)'

    def total_mb(self, obj):
        return f"{obj.total_bytes / (1024 * 1024):.2f} MB"

    total_mb.short_description = 'Total (MB)'


@admin.register(BandwidthLog)
class BandwidthLogAdmin(ReadOnlyAdminMixin, admin.ModelAdmin):
    list_display = [
        'subscription', 'timestamp', 'download_speed', 'upload_speed',
        'latency', 'packet_loss'
    ]
    list_filter = ['timestamp', 'download_speed', 'upload_speed']
    search_fields = ['subscription__subscription_id']
    date_hierarchy = 'timestamp'


# ============================================================================
# NOTIFICATIONS ADMINS
# ============================================================================

@admin.register(NotificationTemplate)
class NotificationTemplateAdmin(CompanyFilterMixin, admin.ModelAdmin):
    list_display = [
        'name', 'notification_type', 'channel', 'company',
        'is_active', 'send_delay'
    ]
    list_filter = ['notification_type', 'channel', 'company', 'is_active']
    search_fields = ['name', 'subject', 'message']
    list_editable = ['is_active']


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = [
        'subject', 'recipient', 'channel', 'status',
        'sent_at', 'delivered_at', 'read_at'
    ]
    list_filter = ['channel', 'status', 'sent_at', 'delivered_at']
    search_fields = ['subject', 'message', 'recipient__username']
    readonly_fields = ['sent_at', 'delivered_at', 'read_at']


# ============================================================================
# SYSTEM LOGS ADMINS
# ============================================================================

@admin.register(SystemLog)
class SystemLogAdmin(ReadOnlyAdminMixin, admin.ModelAdmin):
    list_display = [
        'level', 'action_type', 'user', 'message_preview',
        'ip_address', 'created_at'
    ]
    list_filter = ['level', 'action_type', 'created_at', 'user']
    search_fields = ['message', 'user__username', 'ip_address']
    date_hierarchy = 'created_at'

    def message_preview(self, obj):
        return obj.message[:50] + "..." if len(obj.message) > 50 else obj.message

    message_preview.short_description = 'Message Preview'


# ============================================================================
# ADMIN SITE CUSTOMIZATION
# ============================================================================

admin.site.site_header = "ISP Management System"
admin.site.site_title = "ISP Admin"
admin.site.index_title = "Welcome to ISP Management System"


# Custom admin dashboard stats (optional)
def admin_stats_view(request):
    """Custom admin index view with statistics"""
    from django.shortcuts import render

    # Calculate statistics
    stats = {
        'total_customers': Customer.objects.count(),
        'active_customers': Customer.objects.filter(status='active').count(),
        'total_subscriptions': Subscription.objects.count(),
        'active_subscriptions': Subscription.objects.filter(status='active').count(),
        'open_tickets': Ticket.objects.filter(status__in=['open', 'in_progress']).count(),
        'overdue_tickets': Ticket.objects.filter(
            status__in=['open', 'in_progress'],
            sla_resolution_due__lt=timezone.now()
        ).count(),
        'monthly_revenue': Invoice.objects.filter(
            issue_date__month=timezone.now().month,
            status='paid'
        ).aggregate(total=Sum('total_amount'))['total'] or 0,
        'pending_payments': Payment.objects.filter(status='pending').count(),
    }

    return render(request, 'admin/dashboard_stats.html', {'stats': stats})


# Optional: Custom admin actions
def export_as_csv(modeladmin, request, queryset):
    """Export selected objects as CSV"""
    import csv
    from django.http import HttpResponse

    meta = modeladmin.model._meta
    field_names = [field.name for field in meta.fields]

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename={meta}.csv'
    writer = csv.writer(response)

    writer.writerow(field_names)
    for obj in queryset:
        writer.writerow([getattr(obj, field) for field in field_names])

    return response


export_as_csv.short_description = "Export Selected as CSV"

# Add the export action to relevant admin classes
for admin_class in [CustomerAdmin, SubscriptionAdmin, TicketAdmin, InvoiceAdmin]:
    actions = list(getattr(admin_class, 'actions', []))
    actions.append(export_as_csv)
    admin_class.actions = actions
