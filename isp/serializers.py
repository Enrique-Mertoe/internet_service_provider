from rest_framework import serializers
from isp.models import (
    Customer, InternetPackage, Subscription, Ticket, Payment, Invoice,
    TicketCategory, TicketComment, PackageCategory, NetworkZone,
    NetworkEquipment, IPAddressPool, IPAddress, UsageLog, BandwidthLog,
    Company, User, UserProfile
)


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='get_full_name', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name',
                  'user_type', 'phone', 'company', 'is_active', 'date_joined']
        read_only_fields = ['date_joined']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request_user = self.context['request'].user

        # Only show salary to admins or the user themselves
        if (request_user.user_type in ['super_admin', 'billing_admin'] or
                request_user.id == instance.id):
            data['salary'] = instance.salary
            data['employee_id'] = instance.employee_id
            data['hire_date'] = instance.hire_date

        return data

    def get_company(self, obj):
        if obj.company:
            return {
                'id': obj.company.id,
                'name': obj.company.name,
                'address': obj.company.address,
                'phone': obj.company.phone,
                'email': obj.company.email,
                'currency': obj.company.currency,
            }
        return None


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    # name = serializers.CharField(source='full_name', read_only=True)
    phone = serializers.CharField(source='primary_phone', read_only=True)
    email = serializers.CharField(source='primary_email', read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'customer_type', 'status', 'user', 'full_name',
                  'phone', 'email', 'primary_phone', 'secondary_phone', 'primary_email',
                  'secondary_email', 'installation_address', 'billing_address', 'city',
                  'state', 'postal_code', 'country', 'business_name', 'activation_date', 'termination_date',
                  'credit_limit', 'current_balance', 'auto_pay_enabled',
                  'email_notifications', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']


class PackageCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PackageCategory
        fields = '__all__'


class InternetPackageSerializer(serializers.ModelSerializer):
    category = PackageCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    subscribers_count = serializers.IntegerField(read_only=True)
    can_subscribe = serializers.BooleanField(read_only=True)

    class Meta:
        model = InternetPackage
        fields = '__all__'
        read_only_fields = ['current_subscribers', 'company', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    package = InternetPackageSerializer(read_only=True)
    customer_id = serializers.IntegerField(write_only=True)
    package_id = serializers.IntegerField(write_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    data_usage_percentage = serializers.FloatField(read_only=True)

    class Meta:
        model = Subscription
        fields = '__all__'
        read_only_fields = ['subscription_id', 'created_at', 'updated_at']


class TicketCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketCategory
        fields = '__all__'


class TicketCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = TicketComment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class TicketSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    category = TicketCategorySerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)
    customer_id = serializers.IntegerField(write_only=True)
    category_id = serializers.IntegerField(write_only=True, required=False)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'
        read_only_fields = ['ticket_id', 'created_at', 'updated_at']


class PaymentSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    invoice = serializers.StringRelatedField(read_only=True)
    processed_by = UserSerializer(read_only=True)
    customer_id = serializers.IntegerField(write_only=True)
    invoice_id = serializers.IntegerField(write_only=True, required=False)
    processed_by_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['payment_id', 'created_at', 'updated_at']


class InvoiceSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    subscription = SubscriptionSerializer(read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    customer_id = serializers.IntegerField(write_only=True)
    subscription_id = serializers.IntegerField(write_only=True, required=False)
    is_overdue = serializers.BooleanField(read_only=True)
    balance_due = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['invoice_number', 'created_at', 'updated_at']


class NetworkZoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = NetworkZone
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class NetworkEquipmentSerializer(serializers.ModelSerializer):
    zone = NetworkZoneSerializer(read_only=True)
    zone_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = NetworkEquipment
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class IPAddressPoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = IPAddressPool
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class IPAddressSerializer(serializers.ModelSerializer):
    pool = IPAddressPoolSerializer(read_only=True)
    assigned_to = SubscriptionSerializer(read_only=True)
    pool_id = serializers.IntegerField(write_only=True)
    assigned_to_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = IPAddress
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class UsageLogSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)
    subscription_id = serializers.IntegerField(write_only=True)
    total_bytes = serializers.IntegerField(read_only=True)
    session_duration = serializers.DurationField(read_only=True)

    class Meta:
        model = UsageLog
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']


class BandwidthLogSerializer(serializers.ModelSerializer):
    subscription = SubscriptionSerializer(read_only=True)
    subscription_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = BandwidthLog
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
