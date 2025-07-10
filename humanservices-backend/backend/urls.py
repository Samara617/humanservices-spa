from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from documents.views import InitUploadView, MyDocumentsView
from django.conf import settings
from django.conf.urls.static import static
from documents.views import RegisterView

urlpatterns = [
    # Redirect root to the docs endpoint
    path(
        '',
        RedirectView.as_view(url='documents/my-docs/', permanent=False)
    ),

    # Admin
    path('admin/', admin.site.urls),

    # JWT auth
    path('auth/login/',   TokenObtainPairView.as_view(),  name='token_obtain'),
    path('auth/refresh/', TokenRefreshView.as_view(),     name='token_refresh'),

    # Document endpoints
    path('documents/init-upload/', InitUploadView.as_view(),  name='init_upload'),
    path('documents/my-docs/', MyDocumentsView.as_view(), name='my_documents'),

    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/',    TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/',  TokenRefreshView.as_view(), name='token_refresh'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL, document_root=settings.MEDIA_ROOT
    )

