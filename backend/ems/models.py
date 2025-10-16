from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class MyUserManager(BaseUserManager):
    def create_user(self, name, email, password=None):
        if not name:
            raise ValueError("User name is required")
        if not email:
            raise ValueError("Email is required")
        if not password:
            raise ValueError("Password is required")

        email = self.normalize_email(email)
        user = self.model(name=name, email=email)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, name, email, password):
        user = self.create_user(name=name, email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


#user model
class MyUser(AbstractBaseUser, PermissionsMixin):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True, blank=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    objects = MyUserManager()

    def __str__(self):
        return self.email


#Event model
class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100, blank=False)
    description = models.TextField(blank=False)
    date = models.DateField(blank=False)
    image=models.CharField(max_length=5000,default="https://tse2.mm.bing.net/th/id/OIP.r1JtclIqisiNc0Xgh-au9QHaF2?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3")
    location = models.CharField(max_length=2000)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField(null=False)
    posted_by = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="events")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.posted_by.name}"


#Attendance model
class Attendance(models.Model):
    att_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, blank=False)
    email = models.EmailField(blank=False)
    number = models.CharField(max_length=10,blank=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="attendances")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.event.title}"
