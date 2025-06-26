from rest_framework import viewsets, views, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from isp.models import Customer, InternetPackage, User
from isp.serializers import CustomerSerializer, InternetPackageSerializer, UserSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def filter_queryset(self, queryset): ...


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer

    @action(detail=False, methods=['get'])
    def me(self, request, **kwargs):
        """Get current authenticated user"""
        user = User.objects.select_related('company').get(id=request.user.id)
        serializer = self.get_serializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['patch', 'put'])
    def update_me(self, request, **kwargs):
        """Update current authenticated user"""
        serializer = self.get_serializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def get_queryset(self):
        # Use select_related to avoid N+1 queries
        queryset = User.objects.select_related('company')

        user = self.request.user
        if user.user_type == 'super_admin':
            return queryset
        elif user.user_type == 'customer':
            return queryset.filter(id=user.id)
        return queryset.filter(company=user.company)


class PackageViewSet(viewsets.ModelViewSet):
    queryset = InternetPackage.objects.all()
    serializer_class = InternetPackageSerializer

    def perform_create(self, serializer):
        serializer.save(company=self.request.user.company)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def default(self, request, **kwargs):
        """Get available packages for the current user"""
        packages = InternetPackage.objects.filter(
            company=request.user.company,
            is_active=True
        )
        serializer = self.get_serializer(packages, many=True)
        return Response(serializer.data)


class SubscriptionViewSet(viewsets.ModelViewSet):
    pass


class TicketViewSet(viewsets.ModelViewSet):
    pass


class PaymentViewSet(viewsets.ModelViewSet):
    pass


class InvoiceViewSet(viewsets.ModelViewSet):
    pass


class CustomTokenObtainPairView(TokenObtainPairView):
    pass


class CustomTokenRefreshView(TokenRefreshView):
    pass


class CustomTokenVerifyView(TokenVerifyView):
    pass


class DashboardStatsView(APIView):
    pass


class UsageStatsView(APIView):
    pass


class RevenueStatsView(APIView):
    pass


class ActiveSessionsView(APIView):
    pass


class BandwidthUsageView(APIView):
    pass


class SystemAlertsView(APIView):
    pass


class RadiusIntegrationView(APIView):
    pass


class MikroTikIntegrationView(APIView):
    pass


class WebhookView(APIView):
    pass


class BulkCustomerOperationsView(APIView):
    pass


class BulkSubscriptionOperationsView(APIView):
    pass


class ExportCustomersView(APIView):
    pass


class ExportUsageView(APIView):
    pass


class ExportInvoicesView(APIView):
    pass
