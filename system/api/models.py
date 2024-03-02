from django.db import models
    
class Registry(models.Model):
    """
        Rejestracja wizyty
    """
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=150)

    address = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    date = models.DateField()

    deleted = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f'Registry: {self.user.first_name} {self.user.last_name} - {self.date}'