
from django.apps import AppConfig


class RoutesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'routes'
    verbose_name = 'Django React Routes'

    def ready(self):
        # Generate routes on startup in development
        from django.conf import settings

        # Check if auto-generation is enabled in settings
        auto_generate = getattr(settings, 'ROUTE_GENERATOR', {}).get('AUTO_GENERATE', False)

        if settings.DEBUG and auto_generate:
            from django.core.management import call_command
            try:
                call_command('generate_routes')
            except Exception:
                pass  # Don't fail if route generation fails
