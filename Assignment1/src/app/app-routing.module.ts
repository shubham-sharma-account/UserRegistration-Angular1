import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EditComponent } from './dashboard/edit/edit.component';
import { Auth2Guard } from './auth2.guard';

const routes: Routes = [
  {path : 'signup', component: SignupComponent, canActivate: [Auth2Guard]},
  {path : 'login', component: LoginComponent, canActivate: [Auth2Guard]},
  {path : 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path : 'edit', component: EditComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }