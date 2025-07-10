from django.db import models
from django.contrib.auth.models import User

class SecureDocument(models.Model):
    owner    = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(
        max_length=30,
        choices=[
          ('paystub','Paystub'),
          ('bank_statement','Bank Statement'),
          ('birth_certificate','Birth Certificate'),
          ('other','Other')
        ]
    )
    file     = models.FileField(upload_to='secure_docs/')
    status   = models.CharField(
        max_length=20,
        choices=[('Pending','Pending'),('Approved','Approved'),('Rejected','Rejected')],
        default='Pending'
    )
    uploaded = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.username} — {self.category}"
from django.db import models

# Create your models here.
