import io
from django.http import HttpResponse, JsonResponse
from rest_framework import generics

from users.pagination import CustomPagination
import xlsxwriter
from .models import Department, Location, User
from .serializer import DepartmentSerializer, LocationSerializer, UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework import filters
from django.contrib.auth import get_user_model

#To fetch User Details ,Using Pagination 
class UserAll(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'email']  # Specify the fields you want to search

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(name__icontains=search_query) | queryset.filter(email__icontains=search_query)
        return queryset

def download_users_excel(request):
    
   # Fetch all users from the database
    users = User.objects.all().order_by('id')

  # Create a new Excel workbook and add a worksheet
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output)
    worksheet = workbook.add_worksheet()

    # Define cell formats
    header_format = workbook.add_format({'bold': True, 'border': 1, 'bg_color': '#cccccc'})
    data_format = workbook.add_format({'border': 1})

    # Write headers to the worksheet
    headers = ['ID', 'Name', 'Email', 'Gender', 'Department', 'Location', 'Date of Joining']
    for col, header in enumerate(headers):
        worksheet.write(0, col, header, header_format)

    # Write data to the worksheet
    for row, user in enumerate(users, start=1):
        worksheet.write(row, 0, user.id, data_format)
        worksheet.write(row, 1, user.name, data_format)
        worksheet.write(row, 2, user.email, data_format)
        worksheet.write(row, 3, user.gender, data_format)
        worksheet.write(row, 4, user.department, data_format)
        worksheet.write(row, 5, user.location, data_format)
        worksheet.write(row, 6, user.dateOfJoining.strftime('%d-%m-%Y'), data_format)

    # Set column widths
    worksheet.set_column('A:A', 10)  # ID
    worksheet.set_column('B:B', 20)  # Name
    worksheet.set_column('C:C', 30)  # Email
    worksheet.set_column('D:D', 10)  # Gender
    worksheet.set_column('E:E', 20)  # Department
    worksheet.set_column('F:F', 20)  # Location
    worksheet.set_column('G:G', 15)  # Date of Joining

    # Close the workbook
    workbook.close()

    # Set response headers
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=users.xlsx'

    # Write workbook content to the response
    output.seek(0)
    response.write(output.read())
    
    return response

#To fetch user Details
class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
   # permission_classes = [IsAuthenticated]
 
 #To Update user Details    
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    #permission_classes = [IsAuthenticated] 
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer

#To fetch Department Details
class DepartmentListCreateAPIView(generics.ListCreateAPIView):
    queryset = Department.objects.all().order_by('id')
    serializer_class = DepartmentSerializer
    #permission_classes = [IsAuthenticated] 

#To update Deparment Details
class DepartmentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all().order_by('id')
    serializer_class = DepartmentSerializer
    #permission_classes = [IsAuthenticated] 

#To fetch Location Details
class LocationListCreateAPIView(generics.ListCreateAPIView):
    queryset = Location.objects.all().order_by('id')
    serializer_class = LocationSerializer
    #permission_classes = [IsAuthenticated] 

#To Update Location Details
class LocationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all().order_by('id')
    serializer_class = LocationSerializer
    #permission_classes = [IsAuthenticated] 

def helloWorld(HttpRequest):
    return HttpResponse("Hello World")

#To Login , and Generate JWT Token
class LoginView(APIView):
    def post(self,request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username = username,password = password)
        refresh = RefreshToken.for_user(user)
        return JsonResponse({
            'refresh':str(refresh),
            'access':str(refresh.access_token)
        })
class RestricatedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,format = None):
        return JsonResponse({"response":"YOU ARE ALLOWED"})
    
#To Register the User 
class RegisterView(APIView):
    def post(self, request):
        # Retrieve data from request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')

        # Check if all required fields are provided
        if not username or not email or not password or not confirm_password:
            return JsonResponse({'error': 'Username, email, password, and confirm password are required'}, status=400)

        # Check if passwords match
        if password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        # Create user
        try:
            User = get_user_model()
            user = User.objects.create_user(username=username, email=email, password=password)
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            })
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)