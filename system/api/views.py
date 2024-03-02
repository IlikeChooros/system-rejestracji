from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Q
from . import models, serializers

class RegistryView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        registries = serializers.RegistrySerializer(
            models.Registry.objects.all(), many=True).data
        return Response(registries, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = serializers.UploadRegistrySerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data
        if models.Registry.objects.filter(Q(date=data['date'])).exists():
            return Response({'date': 'Wizyta w tym dniu jest już zarejestrowana'}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(status=status.HTTP_201_CREATED)