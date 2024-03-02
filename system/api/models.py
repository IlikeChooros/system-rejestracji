from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    """
     Osoba rejestrująca się w systemie
    """

    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=150)

    address = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)

    def __str__(self) -> str:
        return f'{self.first_name} {self.last_name}'
    
class Registry(models.Model):
    """
        Rejestracja wizyty
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()

    def __str__(self) -> str:
        return f'Registry: {self.user.first_name} {self.user.last_name} - {self.date}'