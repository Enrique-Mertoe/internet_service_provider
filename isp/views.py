from django.shortcuts import render

# Create your views here.
from django.http import HttpRequest
from inertia import inertia


@inertia("landing/index")
def index(request):
    return {}


@inertia("landing/about")
def about(request):
    return {}

@inertia("landing/index")
def services(request):
    return None

@inertia("landing/index")
def packages(request):
    return None

@inertia("landing/index")
def contact(request):
    return None

@inertia("landing/index")
def support(request):
    return None

@inertia("landing/index")
def terms(request):
    return None


def privacy(request):
    return None