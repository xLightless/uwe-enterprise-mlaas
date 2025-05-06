# flake8: noqa
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

##########################################
# User Models
##########################################

class Role(models.Model):
    role_id = models.AutoField(primary_key=True)
    role_name = models.CharField(max_length=75)

    class Meta:
        db_table = '"Roles"'

    def __str__(self):
        return self.role_name

class Permission(models.Model):
    permission_id = models.AutoField(primary_key=True)
    permission_name = models.CharField(max_length=75)

    class Meta:
        db_table = '"Permissions"'

    def __str__(self):
        return self.permission_name

class RolePermission(models.Model):
    role_permission_id = models.AutoField(primary_key=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='role_id')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, db_column='permission_id')

    class Meta:
        db_table = '"RolePermissions"'

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

    def create_superuser(self, email, full_name, password=None, **extra_fields):
        """Create and return a superuser with admin role"""
        # Find or create admin role
        role, created = Role.objects.get_or_create(
            role_id=2,
            defaults={'role_id': 2, 'role_name': 'Admin'}
        )

        user = self.create_user(
            email=email,
            full_name=full_name,
            password=password,
            role=role
        )

        return user

class Users(AbstractBaseUser):
    user_id = models.AutoField(primary_key=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column='role_id')
    full_name = models.CharField(max_length=70)
    email = models.EmailField(max_length=254, unique=True)
    password = models.TextField(db_column='password_hash')  # Match SQL field name
    created_at = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(default=timezone.now)
    is_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=11, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    stripe_account_id = models.CharField(max_length=255, blank=True, null=True)


    # For Django admin compatibility
    @property
    def is_staff(self):
        return self.role_id == 3

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    class Meta:
        db_table = '"Users"'

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

    def set_password(self, raw_password):
        """Override to set password_hash field instead of password"""
        super().set_password(raw_password)
        self.password_hash = self.password
        self.password = None

###########################################
# Insurance Models
###########################################

class Accident(models.Model):
    accident_id = models.AutoField(primary_key=True)
    accident_type = models.CharField(max_length=75)

    class Meta:
        db_table = '"Accidents"'

    def __str__(self):
        return self.accident_type

class Weather(models.Model):
    weather_id = models.AutoField(primary_key=True)
    weather_conditions = models.CharField(max_length=50)

    class Meta:
        db_table = '"Weather"'

    def __str__(self):
        return self.weather_conditions

class Vehicle(models.Model):
    vehicle_id = models.AutoField(primary_key=True)
    vehicle_type = models.CharField(max_length=50)

    class Meta:
        db_table = '"Vehicles"'

    def __str__(self):
        return self.vehicle_type

class Driver(models.Model):
    driver_id = models.AutoField(primary_key=True)
    driver_age = models.IntegerField()
    gender = models.CharField(max_length=25)
    number_of_passengers = models.IntegerField(default=0)

    class Meta:
        db_table = '"Drivers"'

    def __str__(self):
        return f"Driver {self.driver_id} - Age: {self.driver_age}, Gender: {self.gender}"

class UserVehicle(models.Model):
    user_vehicle_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, db_column='vehicle_id')
    vehicle_age = models.IntegerField()
    driver = models.ForeignKey(Driver, on_delete=models.CASCADE, db_column='driver_id')

    class Meta:
        db_table = '"UserVehicle"'

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
        db_table = '"UserAccident"'

    def __str__(self):
        return f"Accident {self.user_accident_id} - Type: {self.accident.accident_type}, Date: {self.accident_date}"

class Claim(models.Model):
    claim_id = models.AutoField(primary_key=True)
    injury_prognosis = models.CharField(max_length=255)
    injury_description = models.TextField()
    police_report_filed = models.BooleanField(default=False)
    claim_date = models.DateTimeField()
    witness_present = models.BooleanField(default=False)

    # Special damages fields
    SpecialHealthExpenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialReduction = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialOverage = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialAdditionalInjury = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialEarningsLoss = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialUsageLoss = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialMedication = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialAssetDamage = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialRehabilitation = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialFixes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialLoanerVehicle = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialTripCosts = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialJourneyExpenses = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    SpecialTherapy = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # General damages fields
    GeneralRest = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    GeneralFixed = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    GeneralUplift = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Injury indicators
    Exceptional_Circumstances = models.BooleanField(default=False)
    Minor_Psychological_Injury = models.BooleanField(default=False)
    Dominant_injury = models.CharField(max_length=100, null=True, blank=True)
    Whiplash = models.BooleanField(default=False)

    class Meta:
        db_table = '"Claims"'

    def __str__(self):
        return f"Claim {self.claim_id} - Date: {self.claim_date}"

class UserClaim(models.Model):
    user_claim_id = models.AutoField(primary_key=True)
    user_accident = models.ForeignKey(UserAccident, on_delete=models.CASCADE, db_column='user_accident_id')
    claim = models.ForeignKey(Claim, on_delete=models.CASCADE, db_column='claim_id')
    predicted_settlement_value = models.DecimalField(max_digits=10, decimal_places=2)
    PENDING_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('settled', 'Settled'),
    ]
    pending_claim = models.CharField(max_length=50, choices=PENDING_CHOICES, default='pending')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')

    class Meta:
        db_table = '"UserClaims"'

    def __str__(self):
        return f"User Claim {self.user_claim_id} - User: {self.user.email}, Settlement: {self.predicted_settlement_value}"

#########################################
# Payment Models
#########################################

class Invoice(models.Model):
    invoice_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    due_date = models.DateTimeField()
    status = models.BooleanField()
    generated_at = models.DateTimeField()

    class Meta:
        db_table = '"Invoices"'

    def __str__(self):
        return f"Invoice {self.invoice_id} - Amount: {self.total_amount}, Due: {self.due_date}"

class Payment(models.Model):
    payment_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.BooleanField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = '"Payments"'

    def __str__(self):
        return f"Payment {self.payment_id} - Amount: {self.amount}, Status: {self.status}"

#########################################
# Log Models
#########################################

class ActivityLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    ip_address = models.GenericIPAddressField()
    description = models.TextField()
    status_code = models.CharField(max_length=3)
    generated_at = models.DateTimeField()
    event_type = models.CharField(max_length=100)
    device_info = models.TextField(blank=True, null=True)

    class Meta:
        db_table = '"ActivityLogs"'
        ordering = ['-generated_at']

    def __str__(self):
        return f"{self.event_type} - {self.user.email}"

class AuditLog(models.Model):
    audit_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    created_at = models.DateTimeField()
    crud_action_type = models.CharField(max_length=75)
    table_name = models.CharField(max_length=255)
    table_column = models.CharField(max_length=255)
    table_record_id = models.IntegerField()
    action_details = models.TextField()

    class Meta:
        db_table = '"AuditLogs"'

    def __str__(self):
        return f"{self.crud_action_type} on {self.table_name} - {self.created_at}"

#####################################
# ML Models
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
    label_encoder_file = models.TextField(default='')

    class Meta:
        db_table = '"Models"'

    def __str__(self):
        return f"{self.model_name} v{self.model_version}"

class ModelUsageLog(models.Model):
    usage_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    model = models.ForeignKey(Model, on_delete=models.CASCADE, db_column='model_id')
    num_predictions = models.IntegerField()
    model_duration = models.DurationField()
    created_at = models.DateTimeField()

    class Meta:
        db_table = '"ModelUsageLogs"'

    def __str__(self):
        return f"Model Usage {self.usage_id} - Model: {self.model.model_name}, Predictions: {self.num_predictions}"

class UserModelFeedback(models.Model):
    feedback_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    settlement_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    expected_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    feedback_rating = models.SmallIntegerField(default=0)
    comments = models.TextField(blank=True, null=True)

    class Meta:
        db_table = '"UserModelFeedback"'

    def __str__(self):
        return f"Feedback {self.feedback_id} - User: {self.user.email}, Rating: {self.feedback_rating}"
