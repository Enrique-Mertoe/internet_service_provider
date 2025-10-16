import datetime
import traceback

from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, render
from django.template.loader import render_to_string
from rest_framework import viewsets, views, status
from rest_framework.decorators import action, authentication_classes, permission_classes, api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from internet_service_provider import settings
from isp.functions import generate_key, get_mode_from_url
from isp.models import Customer, InternetPackage, User, NetworkEquipment
from isp.serializers import CustomerSerializer, InternetPackageSerializer, UserSerializer, NetworkEquipmentSerializer
from mtk.services import Mtk
from mtk.services.fn import get_host


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def filter_queryset(self, queryset): ...

    def perform_create(self, serializer, **kwargs):
        serializer.save(company=self.request.user.company)

    @action(detail=False, methods=['get'])
    def default(self, request, **kwargs):
        """Get available packages for the current user"""
        packages = Customer.objects.filter(
            company=request.user.company,
        )
        serializer = self.get_serializer(packages, many=True)
        return Response(serializer.data)


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

    def get_queryset(self):
        """
        Filter packages based on query parameters.
        Supports filtering by package_type and searching by name.
        """
        queryset = InternetPackage.objects.filter(company=self.request.user.company)

        # Filter by package_type if provided
        package_type = self.request.query_params.get('package_type', None)
        if package_type:
            queryset = queryset.filter(package_type=package_type)

        # Search by name if search parameter is provided
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset

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


class EquipmentViewSet(viewsets.ModelViewSet):
    serializer_class = NetworkEquipmentSerializer
    queryset = NetworkEquipment.objects.all()

    @action(detail=False, methods=['get'])
    def default(self, request, **kwargs):
        """Get available packages for the current user"""
        name = request.query_params.get('name')
        packages = NetworkEquipment.objects.filter(
            company=request.user.company,
        )
        print(request.query_params)

        if name:
            print("nita", name)
            packages = packages.filter(name=name)

        serializer = self.get_serializer(packages, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def provision(self, request, **kwargs):
        """Get available packages for the current user"""
        user = request.user
        router_name = request.data.get('name', 'MTK1')

        try:
            # Create a unique identifier using username and a unique number
            router_identity = f"{user.company.slug}_{router_name}"
            existing_router = NetworkEquipment.objects.filter(identity=router_identity).first()
            if existing_router:
                return Response({
                    "ok": False,
                    "error": f"Router with identity {router_name} already exists."
                })
            mtk_info = {
                "name": router_identity,
                "password": generate_key(),
            }
            auth_code = generate_key(20)
            res = Mtk.provision(router_identity)
            if res.error:
                return Response({
                    "ok": False,
                    "error": "Unable to setup device, try again later.."
                })
            try:
                with transaction.atomic():
                    router = NetworkEquipment.objects.create(
                        name=router_name,
                        equipment_type="router",
                        username=settings.MTK_CONFIG.get("USERNAME"),
                        password=mtk_info["password"],
                        location="ss",
                        auth_code=auth_code,
                        ip_address="",
                        company=request.user.company,
                        identity=router_identity
                    )
                    client_info = {
                        "mtk": router.id,
                        "auth": auth_code,
                    }
                    [script, url, rsc_file] = Mtk.provision_script({
                        **client_info,
                        'timestamp': datetime.datetime.utcnow().isoformat()
                    }, get_host(request))
                    return Response({
                        "ok": True,
                        "script": str(script),
                        "pvr_url": url,
                        "rsc_file": rsc_file
                    })
            except Exception as e:
                print("error", e)
                traceback.print_exc()
                return Response({
                    "ok": False,
                    "error": "Cant process the request right now, try again later. If the problem persists, contact support."
                })
        except Exception as e:
            print("error", e)
            return Response({})


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


class EquipmentAuthorizeView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, encoded_payload=None):
        server_url = get_host(request)
        config_url = f"{server_url}/api/v1/equipments/auth/config/{encoded_payload}"
        script = render_to_string('rsc_files/f2net.rsc', {'url': config_url})

        response = HttpResponse(script, content_type="text/plain")
        response['Content-Disposition'] = 'attachment; filename=script.rsc'
        return response


class EquipmentCertView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, auth_code):
        router = get_object_or_404(NetworkEquipment, auth_code=auth_code)
        cert = Mtk.cert(router.identity)
        response = HttpResponse(cert, content_type="text/plain")
        response['Content-Disposition'] = 'attachment; filename=script.rsc'
        return response


class EquipmentConfigView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, encoded_payload=None, version=None):
        try:
            info = Mtk.rsc_config(encoded_payload)
            router = get_object_or_404(NetworkEquipment, id=info.mtk, auth_code=info.auth)
            if not router:
                raise ValueError("No router found")

            # Determine which server IP to use for walled garden
            server_ip = Mtk.get().config.get("ip", "+6")
            url = get_host(request)

            config = {
                "firewall": "10.8.0.1",
                "secret": router.password,
                "identity": router.identity,
                "mtk_user": settings.MTK_CONFIG["USERNAME"],
                "vpn_url": f"{url}/api/v1/equipments/auth/cert/{info.auth}/",
                "hs_login_url": f"{url}/api/v1/mikrotik/hotspot/{info.auth}/login.html",
                "hs_rlogin_url": f"{url}/api/v1/mikrotik/hotspot/{info.auth}/rlogin.html",
                "walled_garden_host": settings.MTK_CONFIG["URL"],
                "walled_garden_ip": server_ip,
            }
            config["mode"] = get_mode_from_url(config["hs_login_url"])

            # For RouterOS v6, we need additional parameters
            if version == 6:
                config.update({
                    "connect_to": server_ip,
                    "vpn_pass": router.password,
                    "client_cert": f"{router.identity}.config_1"
                })

            file = "vpn_7_config.rsc" if version == 7 else "vpn_6_config.rsc"
            script_lines = render_to_string(f'rsc_files/{file}', {
                'config': config
            })

            response = HttpResponse(script_lines, content_type='text/plain')
            response['Content-Disposition'] = 'attachment; filename=script.rsc'
            return response

        except Exception as e:
            print(e)
            return HttpResponse(f':put "Failed to generate OpenVPN config"', content_type='text/plain')


class HotspotView(APIView):
    authentication_classes = []
    permission_classes = []

    def get(self, request, router_identity, file_name):
        try:
            router = get_object_or_404(NetworkEquipment, auth_code=router_identity)
            if file_name == 'login.html':
                template_name = 'hotspot/login1.html'
            elif file_name == 'rlogin.html':
                template_name = 'hotspot/rlogin.html'
            else:
                return HttpResponse("File not found", status=404)

            # Context data for the template
            context = {
                'url': get_host(request) + "/hotspot/packages",
                'router': router,
                'isp_name': settings.ISP_NAME,
                'support_phone': settings.SUPPORT_PHONE,
                'year': datetime.datetime.now().year
            }
            response = HttpResponse(render(request, template_name, context), content_type='text/plain')
            response['Content-Disposition'] = 'attachment; filename=script.rsc'

            return response

        except Exception as e:
            return HttpResponse(f':put "Failed to serve hotspot files: {str(e)}"', content_type='text/plain')
