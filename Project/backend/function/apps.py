from django.apps import AppConfig
from function.populator.populator import (
    get_empty_tables,
    populate
)


class ProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'function'

    def ready(self):
        """Validated the databases and populates them if they are empty."""
        databases = [
            'users_db',
            'traffic_db',
            'payments_db',
            'ml_db',
            'insurance_db'
        ]

        db_tables = get_empty_tables(databases)
        # if len(db_tables) > 0:
        #     empty_db_tables = {}
        #     for db, tables in db_tables.items():
        #         if len(tables) > 0:
        #             empty_db_tables[db] = tables

        if len(db_tables) > 0:
            empty_db_tables = {}
            for db, tables in db_tables.items():
                if len(tables) > 0:
                    # Not an optimal solution, but ensures that
                    # "UserAccidents" is processed before "UserClaims"
                    if ("UserAccident" in tables):
                        tables.remove("UserAccident")
                        tables.insert(0, "UserAccident")
                    if ("UserClaims" in tables) and (
                        "UserAccident" not in tables
                    ):
                        tables.remove("UserClaims")
                        tables.append("UserClaims")
                    empty_db_tables[db] = tables

            print("********************* " +
                  "Populating empty databases..." +
                  " *********************")
            populate(db_tables)
            print("**************************************" +
                  "***********************************")
