import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../app.service';
import { User } from '../User';
import { DatePipe } from '@angular/common';
import { DepartmentService } from '../department.service';
import { LocationService } from '../location.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  user: User | undefined;
  departments: any[] = [];
  locations: any[] = [];
  isLoggedIn: boolean = false;
  name: string | null | undefined;
  genders: any[] = ['Male', 'Female', 'Other'];
  

  constructor(
    private service: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe,
    private departmentService: DepartmentService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadDepartments();
    this.loadLocations();
    this.name = localStorage.getItem('name');
    const id = this.route.snapshot.params?.['id'];
    this.service.getUser(id).subscribe(
      (data) => {
        this.user = data;
        this.initializeForm();
      },
      (error) => {
        console.error('Failed to fetch user:', error);
      }
    );
  }

  
  // Populate the form with the fetched Details
  initializeForm(): void {
    const departmentId = this.user?.department.toString() || '';
    const locationId = this.user?.location.toString() || '';
  
    const department = this.departments.find(dept => dept.id.toString() === departmentId);
    const location = this.locations.find(loc => loc.id.toString() === locationId);
  
    this.form.setValue({
      name: this.user?.name || '',
      email: this.user?.email || '',
      gender: this.user?.gender || '',
      department: department ? department : null,
      location: location ? location : null,
      dateOfJoining: this.user?.dateOfJoining || null
    });
  }
  
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required]),
    department: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    dateOfJoining: new FormControl('', [Validators.required])
  });

  //To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.service.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to update user details.');
      this.router.navigate(['/login']);
    }
  }

  //On submit it will update the user details
  submit(): void {
    if (this.isLoggedIn && this.user) {
      const formData = this.form.value;
      this.user.name = formData.name ?? '';
      this.user.email = formData.email ?? '';
      this.user.gender = formData.gender ?? '';
  
      // Cast department and location to the correct type
      const departmentId: string | null = formData.department ? (formData.department as any).id : null;
      const locationId: string | null = formData.location ? (formData.location as any).id : null;
  
      this.user.department = departmentId !== null ? departmentId : ''; // Assign empty string if null
      this.user.location = locationId !== null ? locationId : '';
  
      const formattedDate = this.datePipe.transform(formData.dateOfJoining, 'yyyy-MM-dd') || '';
      this.user.dateOfJoining = formattedDate;
  
      this.service.updateUser(this.user.id, this.user).subscribe(
        (data) => {
          console.log('User updated successfully:', data);
          this.router.navigate(['/user']); // Redirect to user list after successful update
        },
        (error) => {
          console.error('Failed to update user:', error);
          // Handle error (e.g., display error message)
        }
      );
    } else {
      alert('You are not logged in. Please log in to update user details.');
      this.router.navigate(['/login']);
    }
  }
  

  //Function to load department details
  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe(
      (departments) => {
        this.departments = departments.map((dept: any) => ({ id: dept.id, name: dept.name }));
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }
  
  //Function to load location details
  loadLocations(): void {
    this.locationService.getLocations().subscribe(
      (locations) => {
        this.locations = locations.map((loc: any) => ({ id: loc.id, name: loc.name }));
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }
}
