# # flake8: noqa
# class MultiDatabaseRouter:
#     """
#     A router to control database operations for different apps/models.
#     """

#     def db_for_read(self, model, **hints):
#         """Point read operations to the appropriate database."""
#         if model._meta.app_label == "Model_management":
#             return "ml_db"
#         elif model._meta.app_label == "users":
#             return "users_db"
#         elif model._meta.app_label == "insurance":
#             return "insurance_db"
#         elif model._meta.app_label == "payments":
#             return "payments_db"
#         elif model._meta.app_label == "traffic":
#             return "traffic_db"
#         return None

#     def db_for_write(self, model, **hints):
#         """Point write operations to the appropriate database."""
#         return self.db_for_read(model, **hints)

#     def allow_relation(self, obj1, obj2, **hints):
#         """Allow relations if both models are in the same database."""
#         db_set = {"users_db", "insurance_db", "ml_db",
#                     "payments_db", "traffic_db"}
#         if obj1._state.db in db_set and obj2._state.db in db_set:
#             return True
#         return None

#     def allow_migrate(self, db, app_label, model_name=None, **hints):
#         """Ensure migrations only apply to the correct database."""
#         if app_label == "Model_management":
#             return db == "ml_db"
#         elif app_label == "users":
#             return db == "users_db"
#         elif app_label == "insurance":
#             return db == "insurance_db"
#         elif app_label == "payments":
#             return db == "payments_db"
#         elif app_label == "traffic":
#             return db == "traffic_db"
#         return None
