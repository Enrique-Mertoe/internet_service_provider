from rest_framework import viewsets, views, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from isp.models import Customer, InternetPackage
from isp.serializers import CustomerSerializer, InternetPackageSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def filter_queryset(self, queryset): ...


class PackageViewSet(viewsets.ModelViewSet):
    queryset = InternetPackage.objects.all()
    serializer_class = InternetPackageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("VALIDATION ERRORS:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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
