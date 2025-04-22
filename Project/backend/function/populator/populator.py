from django.db import connections
import json

parent = __file__[:-12]
control_name = "populated1"


def insert_data(db, t, data, mapping={}, override={}):
    with connections[db].cursor() as cursor:
        for p_item in data:
            item = p_item | override

            print(item)
            keys = [mapping.get(s, s) for s in item.keys()] 
            
            spam = ("%s, "*len(keys))[:-2]
            values = ", ".join(keys)

            print(f"""INSERT INTO "{t}" ({values}) VALUES ({spam})""")

            cursor.execute(f"""INSERT INTO "{t}" ({values}) VALUES ({spam})""",
                           [item[s] for s in item.keys()])


def is_populated():
    with connections['default'].cursor() as cursor:
        cursor.execute(f"""
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = '{control_name}'
        """)
        return bool(cursor.fetchone())


def populate():
    with connections['default'].cursor() as cursor:
        # Create control table if needed
        cursor.execute(f"""
            CREATE TABLE IF NOT EXISTS {control_name} (
                id int PRIMARY KEY
            );
        """)

    with connections['default'].cursor() as cursor:
        with open(parent+"users.json") as f:
            users_data = json.load(f)
            insert_data("default", "Roles", users_data["Roles"])
            insert_data("default", "Permissions", users_data["Permissions"])
            insert_data("default", "RolePermissions", users_data["RolePermissions"])
            insert_data("default", "Users", users_data["Users"],
                        {"password": "password_hash", "updated_at": "last_login"},
                        {"phone_number": "07696907"})
            
        with open(parent+"traffic.json") as f:
            traffic_data = json.load(f)
            insert_data("traffic", "ActivityLogs", traffic_data["ActivityLogs"])
            insert_data("traffic", "AuditLogs", traffic_data["AuditLogs"])
            insert_data("traffic", "ModelUsageLogs", traffic_data["ModelUsageLogs"])