from django.contrib import admin
from .models import Department, Location, User

# Register your models here.
admin.site.register(User)
admin.site.register(Department)
admin.site.register(Location)