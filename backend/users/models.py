from django.db import models
from datetime import date

#Department Model
class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

#Location Model
class Location(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

#User Model
class User(models.Model):
    name = models.CharField(max_length=255)
    email = models.CharField(max_length=255)
    gender = models.CharField(max_length=255)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL ,blank=True,null=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL,blank=True,null=True)
    dateOfJoining = models.DateField()

    def __str__(self):
        return self.name
