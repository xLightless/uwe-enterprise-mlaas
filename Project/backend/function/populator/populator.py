"""
This script populates the database with initial data from JSON files.
"""

from django.db import (
    DataError,
    IntegrityError,
    ProgrammingError,
    connections
)
from psycopg2.errors import (
    ForeignKeyViolation,
    UniqueViolation
)
import json

parent = __file__[:-12]
control_name = "populated1"


def insert_data(db, t, data, mapping={}, override={}):
    """Insert data into the database table."""
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


def drop_django_tables(databases: list[str], excluded_prefixes: tuple[str]):
    """Drop Django tables from the databases."""
    for db in databases:
        with connections[db].cursor() as cursor:
            cursor.execute("""
                SELECT table_name FROM information_schema.tables
                WHERE table_schema = 'public'
            """)
            tables = cursor.fetchall()
            for table in tables:
                table_name = table[0]
                if any(
                    table_name.startswith(prefix)
                    for prefix in excluded_prefixes
                ):
                    cursor.execute(
                        f"DROP TABLE IF EXISTS {table_name} CASCADE;"
                    )


def get_empty_tables(databases: list[str]):
    """Return a map of databases, their table names, and if they are empty."""

    excluded_prefixes = (
        'token_blacklist',
        'authtoken_token',
        'token_blacklist',
        'auth_',
        'django_',
        control_name
    )

    # Drop the any existing django tables that the project doesn't require
    # drop_django_tables(databases, excluded_prefixes)

    db_tables = {}
    for db in databases:
        with open(parent+f"{db.split('_db')[0]}.json", encoding="utf-8") as f:
            data = json.load(f)
            db_tables[db] = list(data.keys())

            f.close()

    empty_tables = {}
    if len(db_tables) > 0:
        for db, table_list in db_tables.items():
            with connections[db].cursor() as cursor:
                cursor.execute("""
                    SELECT table_name FROM information_schema.tables
                    WHERE table_schema = 'public'
                """)
                tables = cursor.fetchall()
                db_existing_tables = {table[0] for table in tables}
                empty_tables[db] = []

                for table_name in table_list:
                    if table_name not in db_existing_tables:
                        empty_tables[db].append(table_name)
                    else:
                        # Check if the table exists in the database
                        # and is empty
                        table_name_str = f'SELECT COUNT(*) FROM "{table_name}"'
                        if not any(
                            table_name.startswith(prefix)
                            for prefix in excluded_prefixes
                        ):
                            cursor.execute(table_name_str)
                            count = cursor.fetchone()[0]
                            if count == 0:
                                empty_tables[db].append(table_name)
    return empty_tables


def populate(db_map: dict[str, list[str]]):
    """
        Populate the database with initial data, retrying if FK
        constraints fail.
    """

    # Ensure control table exists in the default DB
    try:
        with connections['default'].cursor() as cursor:
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {control_name} (
                    id INT PRIMARY KEY
                );
            """)
    except UniqueViolation:
        print(f"Control table {control_name} already exists.")

    for db, original_tables in db_map.items():
        tables = original_tables[:]
        attempted_once = set()

        while tables:
            table = tables.pop(0)

            try:
                with connections[db].cursor() as cursor:
                    # Create the table if it doesn't exist
                    name = db.split('_db')[0]
                    json_path = parent + f"{name}.json"
                    with open(json_path, encoding="utf-8") as f:
                        data = json.load(f)
                        if table in data:
                            columns = data[table][0].keys()
                            column_definitions = [
                                f'"{col}" TEXT' for col in columns
                            ]
                            primary_key = f'"{name}_id" SERIAL PRIMARY KEY'
                            column_definitions.insert(0, primary_key)

                            cursor.execute(f"""
                                CREATE TABLE IF NOT EXISTS "{table}" (
                                    {', '.join(column_definitions)}
                                );
                            """)

                    # Check if the table is empty
                    cursor.execute(f'SELECT COUNT(*) FROM "{table}"')
                    count = cursor.fetchone()[0]

                    if count == 0:
                        print(f"Populating {db}.{table}...")

                        insert_data(db, table, data[table])

                        cursor.execute(
                            f"INSERT INTO {control_name} (id) VALUES (1)"
                        )
            except ForeignKeyViolation:
                pass

            except ProgrammingError:
                pass

            except DataError:
                print(f"Data error in {db}.{table}, skipping.")
                continue

            except (IntegrityError) as e:
                if "violates foreign key constraint" in str(e):
                    if table in attempted_once:
                        print(
                            f"Skipping {db}.{table} " +
                            "Cannot be inserted yet, relies on another table"
                        )
                    else:
                        print(f"FK violation in {db}.{table}, retrying later.")
                        tables.append(table)
                        attempted_once.add(table)
                else:
                    raise
            except (json.JSONDecodeError, FileNotFoundError, KeyError) as e:
                print(f"Unexpected error while populating {db}.{table}: {e}")
