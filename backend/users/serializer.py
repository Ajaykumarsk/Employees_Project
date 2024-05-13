from rest_framework import serializers
from .models import Department, Location, User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

#Department ->id,name
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']
# Location -> id,name
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'name']


# User -> id, name, email, gender, department , location
class UserSerializer(serializers.ModelSerializer):
    departmentName = serializers.PrimaryKeyRelatedField(read_only=True,source='department.name') 
    locationName = serializers.PrimaryKeyRelatedField(read_only=True,source='location.name')
    class Meta:
    
        model = User
        fields = ('id', 'name', 'email', 'gender','department','location','departmentName','locationName','dateOfJoining')
        
User = get_user_model()

#For User Registration -> username,email,password,confirm password
class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('confirm_password'):
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user