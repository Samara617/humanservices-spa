from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from .models import SecureDocument
from .serializers import SecureDocumentSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
import boto3

s3 = boto3.client('s3', region_name=settings.AWS_S3_REGION_NAME)

@method_decorator(csrf_exempt, name='dispatch')
class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]

class InitUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Client sends: { file_name, file_type, category }
        Returns: { upload_url, doc_id }
        """
        user = request.user
        file_name = request.data['file_name']
        file_type = request.data['file_type']
        category  = request.data.get('category','other')

        # Create metadata record first
        doc = SecureDocument.objects.create(
            owner=user, category=category, file=file_name
        )

        key = f"{user.id}/{doc.id}/{file_name}"
        # Generate pre-signed PUT URL
        upload_url = s3.generate_presigned_url(
            'put_object',
            Params={
              'Bucket': settings.AWS_STORAGE_BUCKET_NAME,
              'Key': key,
              'ContentType': file_type,
              'ServerSideEncryption': 'AES256'
            },
            ExpiresIn=900  # 15 minutes
        )

        # Update the FileField to point at the S3 key
        doc.file.name = key
        doc.save(update_fields=['file'])

        return Response({'upload_url': upload_url, 'doc_id': doc.id})

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class   = RegisterSerializer

class MyDocumentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Returns the current user's documents, newest first.
        """
        docs = SecureDocument.objects.filter(owner=request.user)\
                                     .order_by('-uploaded')
        serializer = SecureDocumentSerializer(docs, many=True)
        return Response(serializer.data)
from django.shortcuts import render

# Create your views here.
