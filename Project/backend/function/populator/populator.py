"""
This script populates the database with initial data from default.json.

Written by Ksawery Buczek (22031584), Reece Turner (22036698).
"""

# flake8: noqa
from django.db import (
    DataError,
    IntegrityError,
    ProgrammingError,
    connections
)
import psycopg2
from psycopg2.errors import (
    ForeignKeyViolation,
    UniqueViolation
)

from dateutil.parser import parse
import json
import os

parent = os.path.dirname(__file__) + os.sep
control_name = "populated1"


def insert_data(db, t, data, mapping={}, override={}) -> None:
    """Insert data into the database table."""
    with connections[db].cursor() as cursor:
        for p_item in data:
            item = p_item | override

            print(item)
            keys = [mapping.get(s, s) for s in item.keys()]

            # Ensure keys are quoted to preserve case-sensitivity
            quoted_keys = [f'"{k}"' for k in keys]
            values = ", ".join(quoted_keys)
            placeholders = ("%s, " * len(keys))[:-2]

            print(f"""INSERT INTO "{t}" ({values}) VALUES ({placeholders})""")

            cursor.execute(
                f"""INSERT INTO "{t}" ({values}) VALUES ({placeholders})""",
                [item[s] for s in item.keys()]
            )


def drop_django_tables(databases: list[str], excluded_prefixes: tuple[str]) -> None:
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
                if any(table_name.startswith(prefix) for prefix in excluded_prefixes):
                    cursor.execute(f"DROP TABLE IF EXISTS {table_name} CASCADE;")


def get_empty_tables(databases: list[str]) -> dict[str, list[str]]:
    """Return a map of databases, their table names, and if they are empty."""

    excluded_prefixes = (
        'token_blacklist',
        'authtoken_token',
        'auth_',
        'django_',
        control_name
    )

    db_tables = {}
    with open(parent + "default.json", encoding="utf-8") as f:
        data = json.load(f)
        table_names = list(data.keys())

    for db in databases:
        db_tables[db] = table_names

    empty_tables = {}
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
                    if not any(table_name.startswith(prefix) for prefix in excluded_prefixes):
                        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
                        count = cursor.fetchone()[0]
                        if count == 0:
                            empty_tables[db].append(table_name)

    return empty_tables


def normalize_primary_key(table_name: str) -> str:
    """Normalize the primary key by converting PascalCase to snake_case, removing plurals, and lowercasing."""
    snake_case = ""
    for i, char in enumerate(table_name):
        if char.isupper() and i > 0:
            snake_case += "_"
        snake_case += char.lower()
    if snake_case.endswith('s'):
        snake_case = snake_case[:-1]
    return f"{snake_case}_id"


def get_column_definitions(columns, data, table) -> list[str]:
    """Get the column definitions for the table based on the first row of data."""
    column_definitions = []
    for col in columns:
        first_value = data[table][0][col]
        if isinstance(first_value, int):
            column_type = "INTEGER"
        elif isinstance(first_value, float):
            column_type = "DOUBLE PRECISION"
        elif isinstance(first_value, bool):
            column_type = "BOOLEAN"
        elif isinstance(first_value, str):
            try:
                if first_value.isdigit() and int(first_value) > 2**31 - 1:
                    column_type = "TEXT"
                else:
                    parse(first_value)
                    column_type = "TIMESTAMP"
            except (ValueError, TypeError, OverflowError):
                column_type = "TEXT"
        else:
            column_type = "TEXT"
        column_definitions.append(f'"{col}" {column_type}')
    return column_definitions

def topological_sort(tables: list[str], data: dict[str, list[dict]]) -> list[str]:
    """
    Return a list of tables sorted so that any table's dependencies
    (detected via {other_table}_id columns) come before it.
    If a cycle is detected, returns the original list.
    """
    deps: dict[str, set[str]] = {t: set() for t in tables}
    for t in tables:
        for col in data[t][0].keys():
            if not col.endswith('_id'):
                continue
            for u in tables:
                if f"{normalize_primary_key(u)}" == col:
                    deps[t].add(u)

    sorted_list: list[str] = []
    no_deps = [t for t, d in deps.items() if not d]

    while no_deps:
        n = no_deps.pop()
        sorted_list.append(n)
        for m in deps:
            if n in deps[m]:
                deps[m].remove(n)
                if not deps[m]:
                    no_deps.append(m)

    if len(sorted_list) != len(tables):
        return tables[:]
    return sorted_list

def populate(db_map: dict[str, list[str]]) -> None:
    """Populate the database with initial data from default.json, retrying if FK constraints fail or row count mismatch occurs."""

    # Load default.json once
    with open(parent + "default.json", encoding="utf-8") as f:
        data = json.load(f)

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
        tables = topological_sort(original_tables[:], data)
        failed_tables = set()
        max_retries = 5

        for attempt in range(max_retries):
            print(f"--- Attempt {attempt + 1} to populate tables ---")
            remaining_tables = []

            for table in tables:
                try:
                    with connections[db].cursor() as cursor:
                        normalized_primary_key = normalize_primary_key(table)

                        # Create the table if it doesn't exist
                        if table in data:
                            columns = data[table][0].keys()
                            column_definitions = get_column_definitions(columns, data, table)

                            primary_key = f'"{normalized_primary_key}" SERIAL PRIMARY KEY'
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

                            # Check if the number of rows matches the JSON data
                            cursor.execute(f'SELECT COUNT(*) FROM "{table}"')
                            current_count = cursor.fetchone()[0]

                            if current_count != len(data[table]):
                                print(f"Row count mismatch in table {table}: Expected {len(data[table])}, got {current_count}.")
                                print(f"Attempted rows: {data[table]}")  # Log attempted rows
                                remaining_tables.append(table)  # Re-attempt this table
                            else:
                                print(f"Successfully populated {table} with {current_count} rows.")
                        else:
                            print(f"Table {table} already has {count} rows, skipping population.")

                except (ForeignKeyViolation, IntegrityError) as e:
                    if table not in failed_tables:
                        print(f"Deferring {table} due to FK issue: {e}")
                        remaining_tables.append(table)
                        failed_tables.add(table)
                    else:
                        print(f"Skipping permanently: {table} (repeated FK issue).")
                except (ProgrammingError, DataError) as e:
                    print(f"Skipping {table} due to data error: {e}")
                except (json.JSONDecodeError, FileNotFoundError, KeyError) as e:
                    print(f"Unexpected error while populating {db}.{table}: {e}")

            if not remaining_tables:
                print("All tables populated successfully.")
                break

            tables = remaining_tables
        else:
            print("Some tables could not be populated due to persistent FK issues or row count mismatch:")
            print(failed_tables)

# def populate(db_map: dict[str, list[str]]) -> None:
#     """Populate the database with initial data from default.json, retrying if FK constraints fail."""

#     # Load default.json once
#     with open(parent + "default.json", encoding="utf-8") as f:
#         data = json.load(f)

#     # Ensure control table exists in the default DB
#     try:
#         with connections['default'].cursor() as cursor:
#             cursor.execute(f"""
#                 CREATE TABLE IF NOT EXISTS {control_name} (
#                     id INT PRIMARY KEY
#                 );
#             """)
#     except UniqueViolation:
#         print(f"Control table {control_name} already exists.")

#     for db, original_tables in db_map.items():
#         tables = topological_sort(original_tables[:], data)
#         failed_tables = set()
#         max_retries = 5

#         for attempt in range(max_retries):
#             print(f"--- Attempt {attempt + 1} to populate tables ---")
#             remaining_tables = []

#             for table in tables:
#                 try:
#                     with connections[db].cursor() as cursor:
#                         normalized_primary_key = normalize_primary_key(table)

#                         # Create the table if it doesn't exist
#                         if table in data:
#                             columns = data[table][0].keys()
#                             column_definitions = get_column_definitions(columns, data, table)

#                             primary_key = f'"{normalized_primary_key}" SERIAL PRIMARY KEY'
#                             column_definitions.insert(0, primary_key)

#                             cursor.execute(f"""
#                                 CREATE TABLE IF NOT EXISTS "{table}" (
#                                     {', '.join(column_definitions)}
#                                 );
#                             """)

#                         # Check if the table is empty
#                         cursor.execute(f'SELECT COUNT(*) FROM "{table}"')
#                         count = cursor.fetchone()[0]

#                         if count == 0:
#                             print(f"Populating {db}.{table}...")
#                             insert_data(db, table, data[table])

#                 except (ForeignKeyViolation, IntegrityError) as e:
#                     if table not in failed_tables:
#                         print(f"Deferring {table} due to FK issue: {e}")
#                         remaining_tables.append(table)
#                         failed_tables.add(table)
#                     else:
#                         print(f"Skipping permanently: {table} (repeated FK issue).")
#                 except (ProgrammingError, DataError) as e:
#                     print(f"Skipping {table} due to data error: {e}")
#                 except (json.JSONDecodeError, FileNotFoundError, KeyError) as e:
#                     print(f"Unexpected error while populating {db}.{table}: {e}")

#             if not remaining_tables:
#                 print("All tables populated successfully.")
#                 break

#             tables = remaining_tables
#         else:
#             print("Some tables could not be populated due to persistent FK issues:")
#             print(failed_tables)