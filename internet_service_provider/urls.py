"""
URL configuration for internet_service_provider project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django_js_reverse.views import urls_json

urlpatterns = [
    path('admin/', admin.site.urls),
    # Django JS Reverse JSON endpoint
    path('jsreverse.json', urls_json, name='js_reverse_json'),
    # Dashboard (Main ISP Management Interface)
    path('dashboard/', include('isp.dashboard.urls', namespace='dashboard')),

    # API Endpoints (for mobile apps, integrations, etc.)
    path('api/v1/', include('isp.api.urls', namespace='api')),

    # Authentication URLs
    path('auth/', include('isp.authentication.urls', namespace='auth')),

    # Customer Portal (if you want customer-facing pages)
    path('portal/', include('isp.customer_portal.urls', namespace='portal')),

    # Landing/Marketing Pages
    path('', include('isp.urls', namespace='landing')),

    # Redirect root to dashboard for authenticated users
    path('', RedirectView.as_view(pattern_name='dashboard:overview', permanent=False)),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

    # Debug toolbar for development
    if 'debug_toolbar' in settings.INSTALLED_APPS:
        import debug_toolbar

        urlpatterns = [
                          path('__debug__/', include(debug_toolbar.urls)),
                      ] + urlpatterns
