"""
This script is responsible for populating all the distributed databases
with the realistic dummy data for testing purposes.

Written by Reece Turner, 22036698.
"""

import json
import os
import psycopg2
# from dotenv import load_dotenv
import psycopg2
import os
from datetime import datetime

# Load environment variables from .env file
# load_dotenv()

# conn = psycopg2.connect(host="docker-postgres-db-1", port=5432, user="postgres", password="password")
DB_PARAMS = {
    "host": "docker-postgres-db-1",
    "port": 5432,
    # "database": "users_db",
    "user": "postgres",
    "password": "password"
}

conn = psycopg2.connect(**DB_PARAMS)










# db_params = {
#     'user': os.getenv('DB_USER'),
#     'password': os.getenv('DB_PASSWORD'),
#     'host': os.getenv('DB_HOST'),
#     'port': os.getenv('DB_PORT')
# }


# def insert_users():
#     """
#     Inserts dummy data into the users_db.
#     """

#     users_data = open("users/users.json", "r", encoding="utf-8")
#     users = json.load(users_data)

#     database_name = "users_db"

#     try:
#         # Connect to the PostgreSQL database
#         conn = psycopg2.connect(dbname=database_name, **db_params)
#         cursor = conn.cursor()

#         # Insert data into the Users table
#         for user in users:
#             cursor.execute("""
#                 INSERT INTO "Users" (
#                     user_id, full_name, email, password, created_at,
#                     updated_at, is_active, is_verified, is_admin,
#                     is_superuser, is_staff
#                 )
#                 VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
#             """, (
#                 user["user_id"],
#                 user["full_name"],
#                 user["email"],
#                 user["password"],
#                 user["created_at"],
#                 user["updated_at"],
#                 user["is_active"],
#                 user["is_verified"],
#                 user["is_admin"],
#                 user["is_superuser"],
#                 user["is_staff"]
#             ))

#         # Commit the transaction
#         conn.commit()
#         print(f"Data inserted successfully into {database_name}!")

#         cursor.close()
#         conn.close()

#     except Exception as e:
#         print(f"Error inserting data into {database_name}: {e}")


# if __name__ == '__main__':
#     insert_users()
