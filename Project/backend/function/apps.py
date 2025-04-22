from django.apps import AppConfig
from function.populator.populator import is_populated, populate


class ProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'function'

    def ready(sef):
        if is_populated():
            print("Populator has already ran")
            return
        print("Populating database")
        populate()
