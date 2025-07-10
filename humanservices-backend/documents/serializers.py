# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import SecureDocument

class RegisterSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            password=validated_data['password']
        )

class SecureDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecureDocument
        # adjust fields as needed; at minimum:
        fields = ['id', 'owner', 'category', 'file', 'status', 'uploaded']
        read_only_fields = ['id', 'owner', 'status', 'uploaded']