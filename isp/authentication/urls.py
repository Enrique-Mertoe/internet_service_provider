# =============================================================================
# EXAMPLE AUTHENTICATION URLS
# =============================================================================

from django.urls import path
from . import views

app_name = 'auth'

urlpatterns = [
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('register/', views.register_view, name='register'),
    path('password/reset/', views.password_reset_view, name='password_reset'),
    path('password/reset/confirm/', views.password_reset_confirm_view, name='password_reset_confirm'),
    path('profile/', views.profile_view, name='profile'),
    path('change-password/', views.change_password_view, name='change_password'),
]
