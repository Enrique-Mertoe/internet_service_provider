from django.urls import path

from isp import views

app_name = 'landing'

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('services/', views.services, name='services'),
    path('packages/', views.packages, name='packages'),
    path('contact/', views.contact, name='contact'),
    path('support/', views.support, name='support'),
    path('terms/', views.terms, name='terms'),
    path('privacy/', views.privacy, name='privacy'),
]
