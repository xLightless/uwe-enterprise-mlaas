# flake8: noqa
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone

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



    # def create_superuser(self, email, full_name, password=None, phone_number=None):

    #     admin_role, created = Role.objects.get_or_create(
    #         role_id=4,
    #         defaults={'role_id': 4, 'role_name': 'Admin'}
    #     )

    #     user = self.create_user(
    #         email,
    #         full_name=full_name,
    #         password=password,
    #         role=admin_role,
    #         phone_number=phone_number,
    #     )
    #     user.is_admin = True
    #     user.is_staff = True
    #     user.is_superuser = True
    #     user.save(using=self._db)
    #     return user

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


class ActivityLog(models.Model):
    log_id = models.AutoField(primary_key=True, db_column='log_id')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='user_id')
    ip_address = models.GenericIPAddressField()
    description = models.TextField()
    status_code = models.CharField(max_length=3)
    generated_at = models.DateTimeField(auto_now_add=True)
    event_type = models.CharField(max_length=100)
    device_info = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'ActivityLogs'
        ordering = ['-generated_at']

    def __str__(self):
        return f"{self.event_type} - {self.user.email}"