from . import models
from rest_framework import serializers
import datetime

class FastBaseSerializer():
    def __init__(self, queryset, many=False) -> None:
        self.data = dict()
        if many:
            self.data = [self.serialize(entry) for entry in queryset]
        else:
            self.data = self.serialize(queryset)

    def serialize(self, entry):
        pass


def getFieldWithNoneSupport(obj: models.models.Model = None, field='name', default=None):
    return obj.__getattribute__(field) if obj else default


def formatDate(date: datetime.datetime, default=None):
    return date.strftime('%Y-%m-%d') if date else default

class RegistrySerializer(FastBaseSerializer):
    def serialize(self, entry: models.Registry):
        return {
            'date': formatDate(entry.date),
        }

class DataRegistrySerializer(FastBaseSerializer):
    def serialize(self, entry: models.Registry):
        return {
            'first_name': entry.first_name,
            'last_name': entry.last_name,
            'phone_number': entry.phone_number,
            'address': entry.address,
            'email': entry.email,
            'date': formatDate(entry.date),
        }

class UploadRegistrySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Registry
        fields = '__all__'
        extra_kwargs = {
            'email': {'error_messages': {'unique': 'Email jest już zajęty'}},
            'phone_number': {'error_messages': {'unique': 'Numer telefonu jest już zajęty'}},
        }