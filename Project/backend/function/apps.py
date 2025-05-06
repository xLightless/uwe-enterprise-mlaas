from django.apps import AppConfig
from function.populator.populator import get_empty_tables, populate

class ProjectConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'function'
    
    def ready(self):
        """Validates the database and populates tables if they are empty."""
        import os
        # Prevent running twice in development
        if os.environ.get('RUN_MAIN', None) != 'true':
            # Fix: Pass a list of database names, not a string
            database_list = ['default']  # Using only default database
            
            # Get empty tables from the database(s)
            empty_tables = get_empty_tables(database_list)
            
            if empty_tables:
                # Check if we need to reorder tables for dependency purposes
                for db in database_list:
                    tables = empty_tables.get(db, [])
                    if tables:
                        if "UserAccident" in tables:
                            tables.remove("UserAccident")
                            tables.insert(0, "UserAccident")
                        if "UserClaims" in tables and "UserAccident" not in tables:
                            tables.remove("UserClaims")
                            tables.append("UserClaims")
                        
                        empty_tables[db] = tables
                
                print("********************* " +
                      "Populating empty database tables..." +
                      " *********************")
                populate(empty_tables)
                print("**************************************" +
                      "***********************************")
