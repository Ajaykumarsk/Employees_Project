import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../layout/service/app.layout.service';
import { Message } from 'primeng/api/message';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  username: string = '';
  password: string = '';
  loginError: string = '';
  messages!: Message[];

  constructor(private http: HttpClient,private router: Router,public layoutService: LayoutService) { }
 
  //Function to check Username and Password for Login 
  login() {
    // Ensure both username and password are provided
    if (!this.username || !this.password) {
      console.error('Username and password are required.');
      return;
    }

    // Make HTTP POST request to obtain token
    this.http.post<any>('http://127.0.0.1:8000/api/login/', { 
      username: this.username, 
      password: this.password 
    }).subscribe(response => {
      // Handle successful login
      localStorage.setItem('token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      // Redirect or perform further actions
      this.router.navigate(['user'])
    }, error => {
      // Handle login error
      console.error('Login failed:', error);
      this.messages = [{ severity: 'error', detail: 'Invaild Username/Password' }];
    });
  }
}