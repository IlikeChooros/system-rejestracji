from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status, viewsets, filters
from rest_framework_jwt.authentication import JSONWebTokenAuthentication, get_user_model
from rest_framework_jwt.settings import api_settings
from django.db.models import Q
from django.http import HttpRequest
from . import models, serializers, email, api_filters

UserModel = get_user_model()
jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

def verifyRegistry(registry, uuid):
    if models.Registry.objects.filter(Q(date=registry['date']) & Q(deleted=False) & ~Q(registry_uuid=uuid)).exists():
        return {'detail': 'Wizyta w tym dniu jest już zarejestrowana'}

    if models.Registry.objects.filter(Q(phone_number=registry['phone_number']) & Q(deleted=False) & ~Q(registry_uuid=uuid)).exists():
        return {'detail': 'Numer telefonu jest już zajęty'}

    if models.Registry.objects.filter(Q(email__gt='') & Q(email=registry['email']) & Q(deleted=False) & ~Q(registry_uuid=uuid)).exists():
        return {'detail': 'Email jest już zajęty'}
    return None

class RegistryView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        exclude = request.GET.get('exclude', None)
        qs = models.Registry.objects.filter(Q(deleted=False))
        if exclude:
            qs = qs.exclude(registry_uuid=exclude)
        registries = serializers.RegistrySerializer(qs, many=True).data
        return Response(registries, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = serializers.UploadRegistrySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        
        error = verifyRegistry(data, None)
        if error:
            return Response(error, status=status.HTTP_400_BAD_REQUEST)
        
        created = serializer.save()
        if created.email:
            email.send_confirmation(request, created.email, created.registry_uuid)
        return Response(status=status.HTTP_201_CREATED)
    
class ManageRegistryView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def get(self, request, pk):
        if isinstance(pk, str) and len(pk) != 36:
            return Response({'detail': 'Niepoprawny format identyfikatora'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            registry = models.Registry.objects.get(registry_uuid=pk)
            if not request.user.is_superuser and registry.deleted:
                raise models.Registry.DoesNotExist()
            
            return Response(serializers.DataRegistrySerializer(registry).data, status=status.HTTP_200_OK)
        except models.Registry.DoesNotExist:
            return Response({'detail': 'Rejestracja nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        if isinstance(pk, str) and len(pk) != 36:
            return Response({'detail': 'Niepoprawny format identyfikatora'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            registry = models.Registry.objects.get(registry_uuid=pk)
            if not request.user.is_superuser and registry.deleted:
                raise models.Registry.DoesNotExist()
            serializer = serializers.UploadRegistrySerializer(registry, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            data = serializer.validated_data

            # Przy modyfikacji rekordu sprawdzamy czy 
            # użytkownik nie próbuje zmienić status usunięcia rekordu
            serializer.check_user(request)

            error = verifyRegistry(data, registry.registry_uuid)
            if error:
                return Response(error, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except models.Registry.DoesNotExist:
            return Response({'detail': 'Rejestracja nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        if isinstance(pk, str) and len(pk) != 36:
            return Response({'detail': 'Niepoprawny format identyfikatora'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            registry = models.Registry.objects.get(registry_uuid=pk)
            if registry.deleted:
                raise models.Registry.DoesNotExist()
            registry.deleted = True
            registry.save()
            return Response(status=status.HTTP_200_OK)
        except models.Registry.DoesNotExist:
            return Response({'detail': 'Rejestracja nie istnieje'}, status=status.HTTP_404_NOT_FOUND)
        
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        user = UserModel.objects.filter(Q(username=data['username'])).first()
        if not user or not user.check_password(data['password']):
            return Response({'detail': 'Niepoprawne dane'}, status=status.HTTP_400_BAD_REQUEST)
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        return Response({'token': token}, status=status.HTTP_200_OK)
    
class RegistryListView(viewsets.ModelViewSet):
    permission_classes = (
        # permissions.IsAdminUser,
        permissions.AllowAny,
    )
    authentication_classes = (JSONWebTokenAuthentication,)
    queryset = models.Registry.objects.all()
    serializer_class = serializers.ListRegistrySerializer
    http_method_names = ['get']
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    filter_class = api_filters.RegistryFilter
    ordering = ['date']
    ordering_fields = ['date', 'first_name', 'last_name']
    search_fields = ['^first_name', '^last_name', '=date']
    
    def list(self, request: HttpRequest, *args, **kwargs):
        data = request.GET.copy()
        data.setdefault('deleted', 'false')
        qs = self.filter_class(data, queryset=self.get_queryset()).qs
        qs = self.filter_queryset(qs)
        page = self.paginate_queryset(qs) 
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)