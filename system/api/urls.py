from django.urls import path
from . import views

urlpatterns = [
    path('registry', views.RegistryView.as_view(), name='registry'),
]
