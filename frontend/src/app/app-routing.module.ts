import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { RegisterComponent } from './register/register.component';
import { DepartmentComponent } from './department/department.component';
import { UpdateDepartmentComponent } from './update-department/update-department.component';
import { UpdateLocationComponent } from './update-location/update-location.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { LocationComponent } from './location/location.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'user', component: ViewUserComponent },
      { path: 'adduser', component: AddUserComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'location', component: LocationComponent },
      { path: 'updatedepartment/:id', component: UpdateDepartmentComponent },
      { path: 'updatelocation/:id', component: UpdateLocationComponent },
      { path: 'updateuser/:id', component: UpdateUserComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '/login' } // Redirect any unknown routes to login
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
