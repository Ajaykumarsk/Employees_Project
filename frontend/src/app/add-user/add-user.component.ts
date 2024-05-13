import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { DepartmentService } from '../department.service';
import { LocationService } from '../location.service';
import { User } from '../User';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  name: string | null | undefined;
  isLoggedIn: boolean = false;
  departments: any[] = [];
  depId :any;
  locations: any[] = [];
  date: Date[] | undefined;

  // Constructor 
  constructor(
    private userService: UserService,
    private router: Router,
    private departmentService: DepartmentService,
    private locationService: LocationService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.name = localStorage.getItem('name');
    this.loadDepartments();
    this.loadLocations();
  }

  //Function to Check Authentication 
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to access the dashboard.');
      this.router.navigate(['/login']);
    }
  }

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    location: new FormControl('', Validators.required),
    dateOfJoining: new FormControl('', Validators.required)
  });

  //Function To Add User Details from the Form on Submit  
  addUser(): void {
    // Log department and location values
    console.log('Selected department value:', this.form.value.department);
    console.log('Selected location value:', this.form.value.location);
  
    // Log departments and locations
    console.log('Departments:', this.departments);
    console.log('Locations:', this.locations);
  
    const formattedDate = this.datePipe.transform(this.form.value.dateOfJoining, 'yyyy-MM-dd');
  
    // Find the selected department object
    const selectedDepartment = this.departments.find(dept => dept === this.form.value.department);
    // Extract department ID or assign an empty string if not found
    const departmentId = selectedDepartment ? selectedDepartment.id : '';
  
    // Find the selected location object
    const selectedLocation = this.locations.find(loc => loc === this.form.value.location);
    // Extract location ID or assign an empty string if not found
    const locationId = selectedLocation ? selectedLocation.id : '';
  
    const userData: User = {
      id: 0,
      name: this.form.value.name || '',
      email: this.form.value.email || '',
      gender: this.form.value.gender || '',
      dateOfJoining: formattedDate || '',
      department: departmentId.toString(), // Ensure department ID is assigned as a string
      location: locationId.toString(), // Ensure location ID is assigned as a string
    };
  
    console.log('Selected department:', selectedDepartment);
    console.log('Selected location:', selectedLocation);
    console.log('User data:', userData);
    
    this.userService.addUser(userData).subscribe(
      (data) => {
        this.router.navigate(['/user']);
        console.log(userData);
      },
      (error) => {
        console.error('Error adding user:', error);
        console.log(userData);
        // Handle error (e.g., display error message)
      }
    );
  }
  
  //Function to Load Department Details
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.departments = departments;
        console.log('Departments:', this.departments);
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }
  
  //Function to Load Location Details
  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        this.locations = locations;
        console.log('Locations:', this.locations);
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }
  

}