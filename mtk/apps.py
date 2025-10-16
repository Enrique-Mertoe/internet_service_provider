from django.apps import AppConfig

from mtk.services import Mtk


class MtkConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'mtk'
    verbose_name = 'Mikrotik Server'

    def ready(self):
        # Generate routes on startup in development
        from django.conf import settings

        # Check if auto-generation is enabled in settings
        conf = getattr(settings, 'MTK_CONFIG', {})
        try:
            # Mtk.init(host=conf.get("URL", ""))
            pass
        except:
            pass