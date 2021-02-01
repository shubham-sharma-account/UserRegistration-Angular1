import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MyserviceService } from './myservice.service';

@Injectable({
  providedIn: 'root'
})
export class Auth2Guard implements CanActivate {
  constructor(
    private myservice: MyserviceService, 
    private router: Router) {}
  
  canActivate(): boolean {
    if(!this.myservice.loggedIn()){
      return true
    }else{
      this.router.navigate(['/dashboard']);
      return false
    }
  }
}
