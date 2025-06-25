from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.contrib import messages
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from django.contrib.auth.forms import PasswordResetForm, SetPasswordForm
from inertia import inertia, render

import json
import uuid

from isp.models import User


@csrf_exempt
def login_view(request):
    if request.method == 'GET':
        return render(request, 'auth/login', {
            'canResetPassword': True,
            'status': request.GET.get('status')
        })

    if request.method == 'POST':
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            remember = data.get('remember', False)
        else:
            email = request.POST.get('email')
            password = request.POST.get('password')
            remember = request.POST.get('remember', False)

        if email and password:
            user = authenticate(request, username=email, password=password)
            if user is not None:
                login(request, user)
                if not remember:
                    request.session.set_expiry(0)

                if request.content_type == 'application/json':
                    return JsonResponse({
                        'success': True,
                        'redirect': reverse('dashboard:overview')
                    })
                return redirect('dashboard:overview')
            else:
                error_msg = 'Invalid email or password'
                if request.content_type == 'application/json':
                    return JsonResponse({
                        'success': False,
                        'error': error_msg
                    })
                messages.error(request, error_msg)

        if request.content_type == 'application/json':
            return JsonResponse({
                'success': False,
                'error': 'Email and password are required'
            })

        return inertia(request, 'auth/login', {
            'canResetPassword': True,
            'errors': {'email': ['Invalid credentials']}
        })


def logout_view(request):
    logout(request)
    return redirect('auth:login')


@csrf_exempt
def register_view(request):
    if request.method == 'GET':
        return render(request, 'auth/register')

    if request.method == 'POST':
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')

        errors = {}

        if not name:
            errors['name'] = ['Name is required']
        if not email:
            errors['email'] = ['Email is required']
        elif User.objects.filter(email=email).exists():
            errors['email'] = ['Email already exists']
        if not password:
            errors['password'] = ['Password is required']
        elif len(password) < 8:
            errors['password'] = ['Password must be at least 8 characters']
        if password != password_confirmation:
            errors['password_confirmation'] = ['Passwords do not match']

        if errors:
            if request.content_type == 'application/json':
                return JsonResponse({'success': False, 'errors': errors})
            return inertia(request, 'auth/register', {'errors': errors})

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name.split(' ')[0],
            last_name=' '.join(name.split(' ')[1:]) if ' ' in name else '',
            employee_id=None  # Generate a unique employee_id
        )

        login(request, user)

        if request.content_type == 'application/json':
            return JsonResponse({
                'success': True,
                'redirect': reverse('dashboard:overview')
            })
        return redirect('dashboard:overview')
    return JsonResponse({})


@csrf_exempt
def password_reset_view(request):
    if request.method == 'GET':
        return inertia(request, 'auth/forgot-password')

    if request.method == 'POST':
        if request.content_type == 'application/json':
            data = json.loads(request.body)
            email = data.get('email')
        else:
            email = request.POST.get('email')

        if not email:
            error = 'Email is required'
            if request.content_type == 'application/json':
                return JsonResponse({'success': False, 'error': error})
            return inertia(request, 'auth/forgot-password', {'errors': {'email': [error]}})

        try:
            user = User.objects.get(email=email)
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))

            current_site = get_current_site(request)
            reset_url = f"http://{current_site.domain}/auth/password/reset/confirm/?uid={uid}&token={token}"

            send_mail(
                'Password Reset Request',
                f'Click here to reset your password: {reset_url}',
                'noreply@example.com',
                [email],
                fail_silently=False,
            )

            if request.content_type == 'application/json':
                return JsonResponse({'success': True, 'message': 'Password reset email sent'})

            return inertia(request, 'auth/forgot-password', {
                'status': 'We have emailed your password reset link!'
            })

        except User.DoesNotExist:
            if request.content_type == 'application/json':
                return JsonResponse({'success': True, 'message': 'Password reset email sent'})
            return inertia(request, 'auth/forgot-password', {
                'status': 'We have emailed your password reset link!'
            })


@csrf_exempt
def password_reset_confirm_view(request):
    uid = request.GET.get('uid')
    token = request.GET.get('token')

    if request.method == 'GET':
        return inertia(request, 'auth/reset-password', {
            'uid': uid,
            'token': token
        })

    if request.method == 'POST':
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        password = data.get('password')
        password_confirmation = data.get('password_confirmation')
        uid = data.get('uid')
        token = data.get('token')

        errors = {}

        if not password:
            errors['password'] = ['Password is required']
        elif len(password) < 8:
            errors['password'] = ['Password must be at least 8 characters']
        if password != password_confirmation:
            errors['password_confirmation'] = ['Passwords do not match']

        if errors:
            if request.content_type == 'application/json':
                return JsonResponse({'success': False, 'errors': errors})
            return inertia(request, 'auth/reset-password', {
                'errors': errors,
                'uid': uid,
                'token': token
            })

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()

                if request.content_type == 'application/json':
                    return JsonResponse({
                        'success': True,
                        'redirect': reverse('auth:login') + '?status=Password successfully reset!'
                    })
                return redirect('auth:login')
            else:
                error = 'Invalid or expired reset link'
                if request.content_type == 'application/json':
                    return JsonResponse({'success': False, 'error': error})
                return inertia(request, 'auth/reset-password', {
                    'errors': {'token': [error]},
                    'uid': uid,
                    'token': token
                })

        except (User.DoesNotExist, ValueError, TypeError):
            error = 'Invalid reset link'
            if request.content_type == 'application/json':
                return JsonResponse({'success': False, 'error': error})
            return inertia(request, 'auth/reset-password', {
                'errors': {'token': [error]},
                'uid': uid,
                'token': token
            })


@login_required
def profile_view(request):
    return inertia(request, 'auth/profile', {
        'user': {
            'name': request.user.get_full_name() or request.user.username,
            'email': request.user.email,
        }
    })


@login_required
@csrf_exempt
def change_password_view(request):
    if request.method == 'GET':
        return inertia(request, 'auth/confirm-password')

    if request.method == 'POST':
        if request.content_type == 'application/json':
            data = json.loads(request.body)
        else:
            data = request.POST

        current_password = data.get('current_password')
        password = data.get('password')
        password_confirmation = data.get('password_confirmation')

        errors = {}

        if not current_password:
            errors['current_password'] = ['Current password is required']
        elif not request.user.check_password(current_password):
            errors['current_password'] = ['Current password is incorrect']

        if not password:
            errors['password'] = ['New password is required']
        elif len(password) < 8:
            errors['password'] = ['Password must be at least 8 characters']

        if password != password_confirmation:
            errors['password_confirmation'] = ['Passwords do not match']

        if errors:
            if request.content_type == 'application/json':
                return JsonResponse({'success': False, 'errors': errors})
            return inertia(request, 'auth/confirm-password', {'errors': errors})

        request.user.set_password(password)
        request.user.save()

        if request.content_type == 'application/json':
            return JsonResponse({
                'success': True,
                'message': 'Password changed successfully'
            })

        messages.success(request, 'Password changed successfully')
        return redirect('auth:profile')
