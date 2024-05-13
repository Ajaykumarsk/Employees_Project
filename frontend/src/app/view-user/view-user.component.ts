import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../app.service';
import { User } from '../User';
import { Table } from 'primeng/table';
import { Paginator } from 'primeng/paginator';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  providers: [ConfirmationService, MessageService]
})
export class ViewUserComponent implements OnInit {
onGlobalFilter(_t43: Table,$event: Event) {
throw new Error('Method not implemented.');
}
  usersDataSource: User[] = [];
  totalUsers: number = 0;
  maleUsers: number = 0;
  femaleUsers: number = 0;
  pageIndex: number = 0;
  pageSize: number = 10;
  pageSizeOptions: number[] = [10]; // Define desired page size options
  isLoggedIn: any;
  name!: string | null;
  users: number = 0;
  searchQuery: string = '';
  loading: boolean = true;
  @ViewChild('dt') table!: Table;
  @ViewChild('p') paginator!: Paginator;
  @ViewChild('filter') filter!: ElementRef;

  constructor(private userService: UserService, private router: Router,private confirmationService: ConfirmationService, private messageService: MessageService) {}
  
  ngOnInit(): void {
    this.checkAuthentication();
    this.getAllUsers();
    this.getUsersCount();
    this.name = localStorage.getItem('name');
    this.loading = false;
  }

  //To check Authentication
  checkAuthentication(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (!this.isLoggedIn) {
      alert('You are not logged in. Please log in to access the Users.');
      this.router.navigate(['/login']);
    }
  }

  //To search any users with keyword
  applySearchFilter(): void {
    this.pageIndex = 0; // Reset pageIndex when performing a new search
    this.getAllUsers();
  }

  //Function to fetch User details with pagination 
  getAllUsers(): void {
    this.userService.getAllUsers(this.pageIndex + 1, this.pageSize, this.searchQuery).subscribe(
      (data: any) => {
        this.usersDataSource = data.results;
        this.totalUsers = data.count;
      },
      (error) => {
        console.error('Failed to fetch users:', error);
        // Handle error (e.g., display error message)
      }
    );
  }

  //Function to get User Count and Male,Female Count
  getUsersCount(): void {
    this.userService.getUsers().subscribe(
      users => {
        this.users = users.length;
        this.maleUsers = users.filter(user => user.gender === 'Male').length;
        this.femaleUsers = users.filter(user => user.gender === 'Female').length;
      },
      error => {
        console.error('Failed to fetch users:', error);
      }
    );
  }
  
  //Functio to delete User with Id
  deleteUser(id: number): void {
    this.userService.deleteUser(id).subscribe(
      () => {
        console.log('User deleted successfully');
        this.getAllUsers(); // Refresh user list after deletion
      },
      (error) => {
        console.error('Failed to delete user:', error);
      }
    );
  }

  onPageChange(event: any): void {
    this.pageIndex = event.page;
    this.getAllUsers();
  }

  //Function for delete button confirmation to delete record 
  confirm(event: Event ,userId : number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Please confirm to delete the record',
        icon: 'pi pi-exclamation-circle',
        acceptIcon: 'pi pi-check mr-1',
        rejectIcon: 'pi pi-times mr-1',
        acceptLabel: 'Confirm',
        rejectLabel: 'Cancel',
        rejectButtonStyleClass: 'p-button-outlined p-button-sm',
        acceptButtonStyleClass: 'p-button-sm',
        accept: () => {
            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted', life: 3000 });
            this.deleteUser(userId);
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
        }
    });
}

//To clear filter in table
clear(table: Table) {
  table.clear();
  this.filter.nativeElement.value = '';
}

//Function to download the user Details 
download(){
  const fileUrl = "http://127.0.0.1:8000/api/download-users-excel/";
  const anchor = document.createElement('a');
    anchor.style.display = 'none';
    anchor.href = fileUrl;
    anchor.download = 'User-Data'; // Set the filename here

    // Append the anchor to the body
    document.body.appendChild(anchor);

    // Simulate a click on the anchor element to trigger the download
    anchor.click();

    // Remove the anchor from the body
    document.body.removeChild(anchor);

}
}
