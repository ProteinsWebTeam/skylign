from django.contrib import admin

# specify which models will be available in the admin panel

from .models import Job

admin.site.register(Job)
