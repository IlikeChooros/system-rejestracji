from . import models
import django_filters

class RegistryFilter(django_filters.FilterSet):
    class Meta:
        model = models.Registry
        fields = {
            'deleted': ['exact'],
            'date': ['gte', 'lte'],
        }