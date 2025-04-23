from django.apps import AppConfig
from function.populator.populator import (
    get_empty_tables,
    # is_populated,
    populate
)


class ProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'function'

    def ready(sef):
        databases = [
            'users_db',
            'traffic_db',
            'payments_db',
            'ml_db',
            'insurance_db'
        ]

        db_tables = get_empty_tables(databases)
        if len(db_tables) > 0:
            empty_db_tables = {}
            for db, tables in db_tables.items():
                if len(tables) > 0:
                    empty_db_tables[db] = tables

            print("********************* " +
                  "Populating empty databases..." +
                  " *********************")
            populate(db_tables)
            print("************************************* " +
                  "***********************************")
