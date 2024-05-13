from django.urls import path

from users.models import User
from .views import DepartmentDetail, DepartmentListCreateAPIView, LocationDetail, LocationListCreateAPIView, LoginView, RegisterView, RestricatedView, UserAll, UserList, UserDetail, download_users_excel, helloWorld

urlpatterns = [
    path('users/', UserList.as_view(), name="user-list"),
    path('user/', UserAll.as_view(), name="users"),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('hello/', helloWorld, name='hello-world'),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('restricted/',RestricatedView.as_view(),name='restricted'),
    path('departments/', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path('locations/', LocationListCreateAPIView.as_view(), name='location-list-create'),
    path('departments/<int:pk>/', DepartmentDetail.as_view(), name='department-detail'),
    path('locations/<int:pk>/',LocationDetail.as_view(),name='location-detail'),
    path('download-users-excel/', download_users_excel, name='download_users_excel'),

] 