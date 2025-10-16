"""
ISP Management System - Django Models
Django 5.2+ Compatible
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.utils import timezone
from django.urls import reverse
from decimal import Decimal
import uuid
from datetime import datetime, timedelta


# ============================================================================
# BASE MODELS
# ============================================================================

class TimeStampedModel(models.Model):
    """Abstract base model with timestamp fields"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Company(TimeStampedModel):
    """Multi-tenant company model for ISP businesses"""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(unique=True)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    website = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)

    # Business settings
    currency = models.CharField(max_length=3, default='USD')
    timezone = models.CharField(max_length=50, default='UTC')
    billing_cycle = models.CharField(
        max_length=20,
        choices=[
            ('monthly', 'Monthly'),
            ('quarterly', 'Quarterly'),
            ('yearly', 'Yearly'),
        ],
        default='monthly'
    )

    class Meta:
        verbose_name_plural = "Companies"
        ordering = ['name']

    def __str__(self):
        return self.name


# ============================================================================
# USER MANAGEMENT
# ============================================================================

class User(AbstractUser):
    """Extended user model with ISP-specific fields"""

    USER_TYPES = [
        ('super_admin', 'Super Admin'),
        ('network_admin', 'Network Administrator'),
        ('customer_service', 'Customer Service'),
        ('technician', 'Technician'),
        ('billing_admin', 'Billing Administrator'),
        ('customer', 'Customer'),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        related_name='users',
        null=True,
        blank=True
    )
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='customer')
    phone = models.CharField(max_length=20, blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    two_factor_enabled = models.BooleanField(default=False)
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)

    # Employee specific fields
    employee_id = models.CharField(max_length=20, blank=True, null=True, unique=True)
    department = models.CharField(max_length=50, blank=True)
    hire_date = models.DateField(null=True, blank=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    class Meta:
        ordering = ['username']

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username


class UserProfile(TimeStampedModel):
    """Extended user profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=100, blank=True)
    emergency_phone = models.CharField(max_length=20, blank=True)
    skills = models.ManyToManyField('Skill', blank=True)
    certifications = models.ManyToManyField('Certification', blank=True)

    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"


class Skill(models.Model):
    """Technical skills for staff members"""
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(
        max_length=50,
        choices=[
            ('networking', 'Networking'),
            ('hardware', 'Hardware'),
            ('software', 'Software'),
            ('customer_service', 'Customer Service'),
        ]
    )
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Certification(TimeStampedModel):
    """Professional certifications"""
    name = models.CharField(max_length=200)
    issuing_organization = models.CharField(max_length=200)
    issue_date = models.DateField()
    expiry_date = models.DateField(null=True, blank=True)
    certificate_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.name} - {self.issuing_organization}"


# ============================================================================
# CUSTOMER MANAGEMENT
# ============================================================================

class CustomerManager(models.Manager):
    """Custom manager for customers"""

    def active(self):
        return self.filter(status='active')

    def suspended(self):
        return self.filter(status='suspended')


class Customer(TimeStampedModel):
    """Customer model for ISP clients"""

    STATUS_CHOICES = [
        ('lead', 'Lead'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('terminated', 'Terminated'),
    ]

    CUSTOMER_TYPES = [
        ('individual', 'Individual'),
        ('business', 'Business'),
        ('government', 'Government'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='customers')
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='customer_profile')
    full_name = models.CharField(max_length=200)
    # Basic Information
    customer_type = models.CharField(max_length=20, choices=CUSTOMER_TYPES, default='individual')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='lead')

    # Contact Information
    primary_phone = models.CharField(max_length=20)
    secondary_phone = models.CharField(max_length=20, blank=True, null=True)
    primary_email = models.EmailField()
    secondary_email = models.EmailField(blank=True, null=True)

    # Address Information
    installation_address = models.TextField(null=True, blank=True)
    billing_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    country = models.CharField(max_length=100, default='Kenya')

    # Business Information (for business customers)
    business_name = models.CharField(max_length=200, null=True, blank=True)

    # Service Information
    activation_date = models.DateTimeField(null=True, blank=True)
    termination_date = models.DateTimeField(null=True, blank=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    current_balance = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Preferences
    auto_pay_enabled = models.BooleanField(default=False)
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=True)

    objects = CustomerManager()

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['company', 'status']),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()}"

    def get_absolute_url(self):
        return reverse('customer-detail', kwargs={'pk': self.pk})


# ============================================================================
# INTERNET PACKAGES
# ============================================================================

class PackageCategory(models.Model):
    """Categories for internet packages"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Package Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class InternetPackage(TimeStampedModel):
    """Internet service packages offered by ISP"""

    PACKAGE_TYPES = [
        ('hotspot', 'Hotspot'),
        ('pppoe', 'PPPoE'),
        ('fiber', 'Fiber'),
        ('wireless', 'Wireless'),
        ('corporate', 'Corporate'),
    ]

    BILLING_TYPES = [
        ('time_based', 'Time Based'),
        ('data_based', 'Data Based'),
        ('unlimited', 'Unlimited'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='packages')
    category = models.ForeignKey(PackageCategory, on_delete=models.SET_NULL, null=True)

    # Basic Information
    name = models.CharField(max_length=200)
    description = models.TextField()
    package_type = models.CharField(max_length=20, choices=PACKAGE_TYPES)
    billing_type = models.CharField(max_length=20, choices=BILLING_TYPES)

    # Technical Specifications
    download_speed = models.PositiveIntegerField(help_text="Speed in Mbps")
    upload_speed = models.PositiveIntegerField(help_text="Speed in Mbps")
    data_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Data limit in GB")
    time_limit = models.PositiveIntegerField(null=True, blank=True, help_text="Time limit in hours")

    # Quality of Service
    priority_level = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        help_text="1 = Highest, 10 = Lowest"
    )
    burst_speed = models.PositiveIntegerField(null=True, blank=True, help_text="Burst speed in Mbps")
    fair_usage_policy = models.TextField(blank=True)

    # Pricing
    price = models.DecimalField(max_digits=10, decimal_places=2)
    setup_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')

    # Availability
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    max_subscribers = models.PositiveIntegerField(null=True, blank=True)
    current_subscribers = models.PositiveIntegerField(default=0)

    # SLA (Service Level Agreement)
    uptime_guarantee = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=99.9,
        validators=[MinValueValidator(90), MaxValueValidator(100)]
    )
    support_hours = models.CharField(max_length=50, default="24/7")

    class Meta:
        ordering = ['package_type', 'price']
        indexes = [
            models.Index(fields=['package_type', 'is_active']),
            models.Index(fields=['company', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} - {self.download_speed}Mbps"

    @property
    def subscribers_count(self):
        return self.subscriptions.filter(status='active').count()

    def can_subscribe(self):
        if self.max_subscribers:
            return self.subscribers_count < self.max_subscribers
        return True


# ============================================================================
# SUBSCRIPTIONS
# ============================================================================

class Subscription(TimeStampedModel):
    """Customer subscription to internet packages"""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('terminated', 'Terminated'),
        ('expired', 'Expired'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='subscriptions')
    package = models.ForeignKey(InternetPackage, on_delete=models.CASCADE, related_name='subscriptions')

    # Subscription Details
    subscription_id = models.CharField(max_length=30, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Dates
    start_date = models.DateTimeField()
    end_date = models.DateTimeField(null=True, blank=True)
    next_billing_date = models.DateTimeField()
    last_billing_date = models.DateTimeField(null=True, blank=True)

    # Usage Tracking
    data_used = models.BigIntegerField(default=0, help_text="Data used in bytes")
    time_used = models.PositiveIntegerField(default=0, help_text="Time used in minutes")

    # Network Configuration
    assigned_ip = models.GenericIPAddressField(null=True, blank=True)
    mac_address = models.CharField(
        max_length=17,
        blank=True,
        validators=[RegexValidator(r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')]
    )
    username = models.CharField(max_length=100, blank=True)
    password = models.CharField(max_length=100, blank=True)

    # Billing
    monthly_fee = models.DecimalField(max_digits=10, decimal_places=2)
    setup_fee_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Installation
    installation_date = models.DateTimeField(null=True, blank=True)
    installation_technician = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='installations'
    )
    installation_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['subscription_id']),
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['next_billing_date']),
        ]

    def __str__(self):
        return f"{self.subscription_id} - {self.customer.user.get_full_name()}"

    @property
    def is_expired(self):
        if self.end_date:
            return timezone.now() > self.end_date
        return False

    @property
    def data_usage_percentage(self):
        if self.package.data_limit:
            limit_bytes = self.package.data_limit * 1024 * 1024 * 1024  # Convert GB to bytes
            return min((self.data_used / limit_bytes) * 100, 100)
        return 0


# ============================================================================
# NETWORK INFRASTRUCTURE
# ============================================================================

class NetworkZone(TimeStampedModel):
    """Network zones for geographic organization"""
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='network_zones')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    coverage_area = models.TextField(help_text="Geographic area covered")
    coordinates_center = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ['company', 'name']

    def __str__(self):
        return f"{self.company.name} - {self.name}"


class NetworkEquipment(TimeStampedModel):
    """Network equipment inventory"""

    EQUIPMENT_TYPES = [
        ('router', 'Router'),
        ('switch', 'Switch'),
        ('access_point', 'Access Point'),
        ('modem', 'Modem'),
        ('antenna', 'Antenna'),
        ('server', 'Server'),
        ('ups', 'UPS'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('maintenance', 'Under Maintenance'),
        ('faulty', 'Faulty'),
        ('retired', 'Retired'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='network_equipment')
    zone = models.ForeignKey(NetworkZone, on_delete=models.SET_NULL, null=True, blank=True)

    # Basic Information
    name = models.CharField(max_length=200)
    identity = models.CharField(max_length=200)
    username = models.CharField(max_length=200, null=True, blank=True)
    auth_code = models.CharField(max_length=200, null=True, blank=True)
    password = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(
        blank=True,
        help_text="Description of the equipment, including any specifics"
    )
    equipment_type = models.CharField(max_length=20, choices=EQUIPMENT_TYPES)
    brand = models.CharField(max_length=100)
    model = models.CharField(max_length=100)
    serial_number = models.CharField(max_length=100, null=True, unique=True)

    # Technical Specifications
    mac_address = models.CharField(
        max_length=17,
        blank=True,
        validators=[RegexValidator(r'^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$')]
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    firmware_version = models.CharField(max_length=50, blank=True)
    port_count = models.PositiveIntegerField(null=True, blank=True)

    # Status and Location
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    location = models.TextField()
    coordinates = models.CharField(max_length=50, blank=True)

    # Financial Information
    purchase_date = models.DateField(null=True, blank=True)
    purchase_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    warranty_expiry = models.DateField(null=True, blank=True)
    vendor = models.CharField(max_length=200, blank=True)

    # Maintenance
    last_maintenance = models.DateTimeField(null=True, blank=True)
    next_maintenance = models.DateTimeField(null=True, blank=True)
    maintenance_notes = models.TextField(blank=True)

    class Meta:
        ordering = ['equipment_type', 'name']
        indexes = [
            models.Index(fields=['equipment_type', 'status']),
            models.Index(fields=['zone', 'status']),
        ]

    def __str__(self):
        return f"{self.name} ({self.equipment_type})"


class IPAddressPool(TimeStampedModel):
    """IP address pool management"""

    POOL_TYPES = [
        ('public', 'Public'),
        ('private', 'Private'),
        ('management', 'Management'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='ip_pools')
    name = models.CharField(max_length=100)
    network = models.CharField(max_length=50, help_text="e.g., 192.168.1.0/24")
    pool_type = models.CharField(max_length=20, choices=POOL_TYPES)
    gateway = models.GenericIPAddressField(null=True, blank=True)
    dns_primary = models.GenericIPAddressField(null=True, blank=True)
    dns_secondary = models.GenericIPAddressField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    description = models.TextField(blank=True)

    class Meta:
        unique_together = ['company', 'network']

    def __str__(self):
        return f"{self.name} - {self.network}"


class IPAddress(TimeStampedModel):
    """Individual IP address tracking"""

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('reserved', 'Reserved'),
        ('blocked', 'Blocked'),
    ]

    pool = models.ForeignKey(IPAddressPool, on_delete=models.CASCADE, related_name='ip_addresses')
    ip_address = models.GenericIPAddressField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    assigned_to = models.ForeignKey(
        Subscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_ips'
    )
    assigned_date = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = ['pool', 'ip_address']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['assigned_to']),
        ]

    def __str__(self):
        return f"{self.ip_address} ({self.status})"


# ============================================================================
# TICKETING SYSTEM
# ============================================================================

class TicketCategory(models.Model):
    """Categories for support tickets"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    default_priority = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Low'),
            ('medium', 'Medium'),
            ('high', 'High'),
            ('critical', 'Critical'),
        ],
        default='medium'
    )
    sla_response_hours = models.PositiveIntegerField(default=24)
    sla_resolution_hours = models.PositiveIntegerField(default=72)

    class Meta:
        verbose_name_plural = "Ticket Categories"

    def __str__(self):
        return self.name


class Ticket(TimeStampedModel):
    """Support tickets for customer issues"""

    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('pending_customer', 'Pending Customer'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]

    TICKET_TYPES = [
        ('technical', 'Technical Issue'),
        ('billing', 'Billing Inquiry'),
        ('service_request', 'Service Request'),
        ('complaint', 'Complaint'),
        ('feedback', 'Feedback'),
    ]

    # Basic Information
    ticket_id = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='tickets')
    category = models.ForeignKey(TicketCategory, on_delete=models.SET_NULL, null=True)

    # Ticket Details
    subject = models.CharField(max_length=300)
    description = models.TextField()
    ticket_type = models.CharField(max_length=20, choices=TICKET_TYPES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')

    # Assignment
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tickets'
    )
    assigned_date = models.DateTimeField(null=True, blank=True)

    # SLA Tracking
    sla_response_due = models.DateTimeField(null=True, blank=True)
    sla_resolution_due = models.DateTimeField(null=True, blank=True)
    first_response_date = models.DateTimeField(null=True, blank=True)
    resolution_date = models.DateTimeField(null=True, blank=True)

    # Customer Satisfaction
    satisfaction_rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    satisfaction_comment = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ticket_id']),
            models.Index(fields=['status', 'priority']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['customer', 'status']),
        ]

    def __str__(self):
        return f"{self.ticket_id} - {self.subject}"

    @property
    def is_overdue(self):
        if self.sla_resolution_due and self.status not in ['resolved', 'closed']:
            return timezone.now() > self.sla_resolution_due
        return False


class TicketComment(TimeStampedModel):
    """Comments on support tickets"""
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ticket_comments')
    comment = models.TextField()
    is_internal = models.BooleanField(default=False)
    attachments = models.FileField(upload_to='ticket_attachments/', blank=True, null=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment on {self.ticket.ticket_id} by {self.author.username}"


# ============================================================================
# BILLING & PAYMENTS
# ============================================================================

class Invoice(TimeStampedModel):
    """Customer invoices"""

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue'),
        ('cancelled', 'Cancelled'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.CASCADE,
        related_name='invoices',
        null=True,
        blank=True
    )

    # Invoice Details
    invoice_number = models.CharField(max_length=30, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')

    # Dates
    issue_date = models.DateField()
    due_date = models.DateField()
    paid_date = models.DateField(null=True, blank=True)

    # Amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Additional Information
    notes = models.TextField(blank=True)
    terms = models.TextField(blank=True)

    class Meta:
        ordering = ['-issue_date']
        indexes = [
            models.Index(fields=['invoice_number']),
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['due_date', 'status']),
        ]

    def __str__(self):
        return f"{self.invoice_number} - {self.customer.user.get_full_name()}"

    @property
    def is_overdue(self):
        return self.status == 'sent' and timezone.now().date() > self.due_date

    @property
    def balance_due(self):
        return self.total_amount - self.paid_amount


class InvoiceItem(models.Model):
    """Individual items on an invoice"""
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=300)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.description} - {self.invoice.invoice_number}"


class Payment(TimeStampedModel):
    """Customer payments"""

    PAYMENT_METHODS = [
        ('cash', 'Cash'),
        ('bank_transfer', 'Bank Transfer'),
        ('credit_card', 'Credit Card'),
        ('mobile_money', 'Mobile Money'),
        ('cheque', 'Cheque'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='payments')
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='payments',
        null=True,
        blank=True
    )

    # Payment Details
    payment_id = models.CharField(max_length=30, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Transaction Details
    transaction_reference = models.CharField(max_length=100, blank=True)
    payment_date = models.DateTimeField()
    processed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='processed_payments'
    )

    # Additional Information
    notes = models.TextField(blank=True)
    receipt_number = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['-payment_date']
        indexes = [
            models.Index(fields=['payment_id']),
            models.Index(fields=['customer', 'status']),
            models.Index(fields=['payment_date']),
        ]

    def __str__(self):
        return f"{self.payment_id} - {self.amount} - {self.customer.user.get_full_name()}"


# ============================================================================
# USAGE TRACKING
# ============================================================================

class UsageLog(TimeStampedModel):
    """Network usage logs for customers"""
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='usage_logs')

    # Usage Details
    session_start = models.DateTimeField()
    session_end = models.DateTimeField(null=True, blank=True)
    bytes_uploaded = models.BigIntegerField(default=0)
    bytes_downloaded = models.BigIntegerField(default=0)

    # Network Information
    ip_address = models.GenericIPAddressField()
    mac_address = models.CharField(max_length=17, blank=True)
    nas_ip = models.GenericIPAddressField(null=True, blank=True)
    nas_port = models.CharField(max_length=20, blank=True)

    # Session Information
    session_id = models.CharField(max_length=100, blank=True)
    termination_cause = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ['-session_start']
        indexes = [
            models.Index(fields=['subscription', 'session_start']),
            models.Index(fields=['session_start']),
        ]

    def __str__(self):
        return f"{self.subscription.subscription_id} - {self.session_start}"

    @property
    def total_bytes(self):
        return self.bytes_uploaded + self.bytes_downloaded

    @property
    def session_duration(self):
        if self.session_end:
            return self.session_end - self.session_start
        return timezone.now() - self.session_start


class BandwidthLog(TimeStampedModel):
    """Real-time bandwidth monitoring"""
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='bandwidth_logs')

    # Bandwidth Data
    timestamp = models.DateTimeField()
    download_speed = models.PositiveIntegerField(help_text="Speed in Kbps")
    upload_speed = models.PositiveIntegerField(help_text="Speed in Kbps")

    # Quality Metrics
    latency = models.PositiveIntegerField(null=True, blank=True, help_text="Latency in ms")
    packet_loss = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Packet loss percentage"
    )

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['subscription', 'timestamp']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f"{self.subscription.subscription_id} - {self.timestamp}"


# ============================================================================
# NOTIFICATIONS
# ============================================================================

class NotificationTemplate(models.Model):
    """Templates for automated notifications"""

    NOTIFICATION_TYPES = [
        ('welcome', 'Welcome Message'),
        ('billing_reminder', 'Billing Reminder'),
        ('payment_confirmation', 'Payment Confirmation'),
        ('service_activation', 'Service Activation'),
        ('service_suspension', 'Service Suspension'),
        ('maintenance_notice', 'Maintenance Notice'),
        ('ticket_update', 'Ticket Update'),
    ]

    CHANNELS = [
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push Notification'),
    ]

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='notification_templates')
    name = models.CharField(max_length=100)
    notification_type = models.CharField(max_length=30, choices=NOTIFICATION_TYPES)
    channel = models.CharField(max_length=20, choices=CHANNELS)

    # Template Content
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()

    # Settings
    is_active = models.BooleanField(default=True)
    send_delay = models.PositiveIntegerField(default=0, help_text="Delay in minutes")

    class Meta:
        unique_together = ['company', 'notification_type', 'channel']

    def __str__(self):
        return f"{self.name} ({self.channel})"


class Notification(TimeStampedModel):
    """Individual notifications sent to users"""

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    template = models.ForeignKey(
        NotificationTemplate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Notification Details
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    channel = models.CharField(max_length=20, choices=NotificationTemplate.CHANNELS)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    # Delivery Information
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)

    # Additional Data
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'status']),
            models.Index(fields=['status', 'sent_at']),
        ]

    def __str__(self):
        return f"{self.subject} - {self.recipient.username}"


# ============================================================================
# SYSTEM LOGS
# ============================================================================

class SystemLog(TimeStampedModel):
    """System activity logs"""

    LOG_LEVELS = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
        ('critical', 'Critical'),
    ]

    ACTION_TYPES = [
        ('login', 'User Login'),
        ('logout', 'User Logout'),
        ('create', 'Record Created'),
        ('update', 'Record Updated'),
        ('delete', 'Record Deleted'),
        ('payment', 'Payment Processed'),
        ('service_change', 'Service Change'),
        ('system_error', 'System Error'),
    ]

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    level = models.CharField(max_length=20, choices=LOG_LEVELS, default='info')
    action_type = models.CharField(max_length=30, choices=ACTION_TYPES)

    # Log Details
    message = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    # Related Objects
    object_type = models.CharField(max_length=50, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)

    # Additional Data
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'created_at']),
            models.Index(fields=['level', 'created_at']),
            models.Index(fields=['action_type', 'created_at']),
        ]

    def __str__(self):
        return f"{self.level.upper()}: {self.message[:50]}"
