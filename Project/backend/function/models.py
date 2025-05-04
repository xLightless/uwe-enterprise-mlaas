# flake8: noqa
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

##########################################
# Users App Models
##########################################

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)  # Auto-incrementing role ID
    role_name = models.CharField(max_length=255)

    class Meta:
        db_table = 'Roles'
        app_label = 'users'

    def __str__(self):
        return self.role_name

class Permission(models.Model):
    permission_id = models.AutoField(primary_key=True, db_column='permission_id')
    permission_name = models.CharField(max_length=75, db_column='permission_name')

    class Meta:
        db_table = 'Permissions'
        app_label = 'users'

    def __str__(self):
        return self.permission_name

class RolePermission(models.Model):
    role_permission_id = models.AutoField(primary_key=True, db_column='role_permission_id')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='role_id')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, db_column='permission_id')

    class Meta:
        db_table = 'RolePermissions'
        app_label = 'users'

class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None, role=None, phone_number=None):
        if not email:
            raise ValueError('Users must have an email address')

        if role is None:
            role, created = Role.objects.get_or_create(
                role_id=1,
                defaults={'role_id': 1, 'role_name': 'User'}
            )

        user = self.model(
            email=self.normalize_email(email),
            full_name=full_name,
            role=role,
            phone_number=phone_number,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

class Users(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True, db_column='user_id')
    role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='role_id')
    email = models.EmailField(max_length=254, unique=True, db_column='email')
    password = models.TextField(db_column='password_hash')
    created_at = models.DateTimeField(db_column='created_at', default=timezone.now)
    last_login = models.DateTimeField(db_column='last_login', default=timezone.now)

    full_name = models.CharField(max_length=70, db_column='full_name')
    is_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    is_active = models.BooleanField(default=True)

    # Disable builtins
    is_superuser = None

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = 'Users'
        app_label = 'users'

    def __str__(self):
        return self.email

    def get_permissions(self):
        return Permission.objects.filter(
            rolepermission__role=self.role
        ).values_list('permission_name', flat=True)

    def has_permission(self, permission_name):
        return Permission.objects.filter(
            permission_name=permission_name,
            rolepermission__role=self.role
        ).exists()

    def get_user_id(self):
        return self.user_id


###########################################
# Insurance App Models
###########################################

class Accident(models.Model):
    accident_id = models.AutoField(primary_key=True)
    accident_type = models.CharField(max_length=75)

    class Meta:
        db_table = 'Accidents'
        app_label = 'insurance'

    def __str__(self):
        return self.accident_type

class Weather(models.Model):
    weather_id = models.AutoField(primary_key=True)
    weather_conditions = models.CharField(max_length=50)

    class Meta:
        db_table = 'Weather'
        app_label = 'insurance'

    def __str__(self):
        return self.weather_conditions

class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    vehicle_type = models.CharField(max_length=50)

    class Meta:
        db_table = 'Vehicles'
        app_label = 'insurance'

    def __str__(self):
        return self.vehicle_type

class Driver(models.Model):
    driver_id = models.AutoField(primary_key=True)
    driver_age = models.IntegerField()
    gender = models.CharField(max_length=25)
    number_of_passengers = models.IntegerField(default=0)

    class Meta:
        db_table = 'Drivers'
        app_label = 'insurance'

    def __str__(self):
        return f"Driver {self.driver_id} - Age: {self.driver_age}, Gender: {self.gender}"

class UserVehicle(models.Model):
    user_vehicle_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, db_column='vehicle_id')
    vehicle_age = models.IntegerField()
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, db_column='driver_id')

    class Meta:
        db_table = 'UserVehicle'
        app_label = 'insurance'

    def __str__(self):
        return f"User Vehicle {self.user_vehicle_id} - User: {self.user.email}, Vehicle: {self.vehicle.vehicle_type}"

class UserAccident(models.Model):
    user_accident_id = models.AutoField(primary_key=True)
    accident = models.ForeignKey(Accident, on_delete=models.CASCADE, db_column='accident_id')
    weather = models.ForeignKey(Weather, on_delete=models.CASCADE, db_column='weather_id')
    user_vehicle = models.ForeignKey(UserVehicle, on_delete=models.CASCADE, db_column='user_vehicle_id')
    accident_description = models.TextField()
    accident_date = models.DateTimeField()

    class Meta:
        db_table = 'UserAccident'
        app_label = 'insurance'

    def __str__(self):
        return f"Accident {self.user_accident_id} - Type: {self.accident.accident_type}, Date: {self.accident_date}"

class Claim(models.Model):
    claim_id = models.AutoField(primary_key=True)
    injury_prognosis = models.CharField(max_length=255)
    injury_description = models.TextField()
    police_report_filed = models.BooleanField(default=False)
    claim_date = models.DateTimeField()
    witness_present = models.BooleanField(default=False)

    class Meta:
        db_table = 'Claims'
        app_label = 'insurance'

    def __str__(self):
        return f"Claim {self.claim_id} - Date: {self.claim_date}"

class UserClaim(models.Model):
    user_claim_id = models.AutoField(primary_key=True)
    user_accident = models.ForeignKey(UserAccident, on_delete=models.CASCADE, db_column='user_accident_id')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, db_column='claim_id')
    predicted_settlement_value = models.DecimalField(max_digits=10, decimal_places=2)
    pending_status = models.TextChoices('Pending', 'Approved', 'Rejected', 'settled')
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')

    class Meta:
        db_table = 'UserClaims'
        app_label = 'insurance'

    def __str__(self):
        return f"User Claim {self.user_claim_id} - User: {self.user.email}, Settlement: {self.predicted_settlement_value}"

#########################################
# Payments App Models
#########################################

class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateTimeField()
    status = models.BooleanField()
    generated_at = models.DateTimeField()

    class Meta:
        db_table = 'Invoices'
        app_label = 'payments'

    def __str__(self):
        return f"Invoice {self.invoice_id} - Amount: {self.total_amount}, Due: {self.due_date}"

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'Payments'
        app_label = 'payments'

    def __str__(self):
        return f"Payment {self.payment_id} - Amount: {self.amount}, Status: {self.status}"

#########################################
# Traffic App Models
#########################################

class ActivityLogTraffic(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')
    ip_address = models.GenericIPAddressField()
    description = models.TextField()
    status_code = models.CharField(max_length=3)
    generated_at = models.DateTimeField()
    event_type = models.CharField(max_length=100)
    device_info = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'ActivityLogs'
        app_label = 'traffic'
        ordering = ['-generated_at']

    def __str__(self):
        return f"{self.event_type} - {self.user.email}"

class AuditLog(models.Model):
    audit_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')
    created_at = models.DateTimeField()
    crud_action_type = models.CharField(max_length=75)
    table_name = models.CharField(max_length=255)
    table_column = models.CharField(max_length=255)
    table_record_id = models.IntegerField()
    action_details = models.TextField()

    class Meta:
        db_table = 'AuditLogs'
        app_label = 'traffic'

    def __str__(self):
        return f"{self.crud_action_type} on {self.table_name} - {self.created_at}"

class ModelUsageLog(models.Model):
    usage_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('users.Users', on_delete=models.CASCADE, db_column='user_id')
    model_id = models.IntegerField()
    num_predictions = models.IntegerField()
    model_duration = models.DurationField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'ModelUsageLogs'
        app_label = 'traffic'

    def __str__(self):
        return f"Model Usage {self.usage_id} - Model: {self.model_id}, Predictions: {self.num_predictions}"

#####################################
# ML App Models
#####################################

class Model(models.Model):
    model_id = models.AutoField(primary_key=True)
    model_name = models.CharField(max_length=255)
    model_description = models.TextField()
    model_version = models.DecimalField(max_digits=5, decimal_places=2)
    uploaded_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    num_accepted_claims = models.IntegerField(default=0)
    num_rejected_claims = models.IntegerField(default=0)
    model_file = models.TextField()

    class Meta:
        db_table = 'Models'
        app_label = 'Model_management'

    def __str__(self):
        return f"{self.model_name} v{self.model_version}"