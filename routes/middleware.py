# 2. routes/middleware.py
# Middleware to automatically generate routes in development

from django.conf import settings
from django.core.management import call_command
import os
import time


class RouteGeneratorMiddleware:
    """
    Middleware to automatically regenerate routes in development
    when URL patterns change
    """

    def __init__(self, get_response):
        self.get_response = get_response
        self.last_generated = 0
        self.check_interval = 5  # seconds

    def __call__(self, request):
        # Check if auto-generation is enabled in settings
        auto_generate = getattr(settings, 'ROUTE_GENERATOR', {}).get('AUTO_GENERATE', False)

        if settings.DEBUG and auto_generate and self.should_regenerate():
            try:
                call_command('generate_routes')
                self.last_generated = time.time()
            except Exception as e:
                # Don't break the request if route generation fails
                print(f"Route generation failed: {e}")

        response = self.get_response(request)
        return response

    def should_regenerate(self):
        """Check if routes should be regenerated"""
        now = time.time()
        if now - self.last_generated < self.check_interval:
            return False

        # Check if any URL files have been modified
        url_files = self.find_url_files()
        for file_path in url_files:
            if os.path.exists(file_path):
                mtime = os.path.getmtime(file_path)
                if mtime > self.last_generated:
                    return True

        return False

    def find_url_files(self):
        """Find all URLs.py files in the project"""
        url_files = []

        # Add main URLs file
        if hasattr(settings, 'ROOT_URLCONF'):
            root_urlconf = settings.ROOT_URLCONF.replace('.', '/') + '.py'
            url_files.append(root_urlconf)

        # Add app URLs files
        for app in settings.INSTALLED_APPS:
            if not app.startswith('django.'):
                app_urls = app.replace('.', '/') + '/urls.py'
                url_files.append(app_urls)

        return url_files
