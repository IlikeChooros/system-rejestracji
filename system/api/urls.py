from django.urls import path
from . import views

urlpatterns = [
    path('registry', views.RegistryView.as_view(), name='registry'),
    path('registry/<str:pk>', views.ManageRegistryView.as_view(), name='manage-registry'),
    path('login', views.LoginView.as_view(), name='login'),
    path('list/registry', views.RegistryListView.as_view({'get': 'list'}), name='list-registry'),
]
