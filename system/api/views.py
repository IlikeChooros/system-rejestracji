from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Q
from . import models, serializers, email

class RegistryView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        registries = serializers.RegistrySerializer(
            models.Registry.objects.filter(Q(deleted=False)), many=True).data
        return Response(registries, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = serializers.UploadRegistrySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        if models.Registry.objects.filter(Q(date=data['date'])).exists():
            return Response({'details': 'Wizyta w tym dniu jest już zarejestrowana'}, status=status.HTTP_400_BAD_REQUEST)
        

        created = serializer.save()
        if email.send_confirmation(request, created.email, created.registry_uuid):
            return Response(status=status.HTTP_201_CREATED)
        else:
            created.delete()
            return Response({'details': 'Nie udało się wysłać maila potwierdzającego'}, status=status.HTTP_400_BAD_REQUEST)

class ManageRegistryView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request, pk):
        if isinstance(pk, str) and len(pk) != 36:
            return Response({'details': 'Niepoprawny format identyfikatora'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            registry = models.Registry.objects.get(registry_uuid=pk)
            if registry.deleted:
                raise models.Registry.DoesNotExist()
            return Response(serializers.DataRegistrySerializer(registry).data, status=status.HTTP_200_OK)
        except models.Registry.DoesNotExist:
            return Response({'details': 'Rejestracja nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        if isinstance(pk, str) and len(pk) != 36:
            return Response({'details': 'Niepoprawny format identyfikatora'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            registry = models.Registry.objects.get(registry_uuid=pk)
            if registry.deleted:
                raise models.Registry.DoesNotExist()
            serializer = serializers.UploadRegistrySerializer(registry, data=request.data, partial=True)
            if not serializer.is_valid():
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        except models.Registry.DoesNotExist:
            return Response({'details': 'Rejestracja nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        if isinstance(pk, str) and len(pk) != 36:
            return Response({'details': 'Niepoprawny format identyfikatora'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            registry = models.Registry.objects.get(registry_uuid=pk)
            if registry.deleted:
                raise models.Registry.DoesNotExist()
            registry.deleted = True
            registry.save()
            return Response(status=status.HTTP_200_OK)
        except models.Registry.DoesNotExist:
            return Response({'details': 'Rejestracja nie istnieje'}, status=status.HTTP_404_NOT_FOUND)