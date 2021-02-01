import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {

  constructor(
    private http: HttpClient,
    private storageService: LocalStorageService
  ) { }

  url = "http://localhost:3000";

  //post data
  registerUser(customer: Object) {
    return this.http.post(this.url, customer);
  }

  //login service 
  loginUser(customer: Object) {
    console.log(customer);    
    return this.http.post(this.url+'/login', customer);
  }

  userDashboard(token: Object){
    return this.http.post(this.url+'/dashboard', token);
  }

  /**
   * desciption : check token, return false if not present
   */
  loggedIn(){
    return (this.storageService.getToken() || this.storageService.getTokenSession() || this.storageService.getFbData());
  }

  //get User details to edit his/her data
  getUserDetails(data){
    console.log(data);
    return this.http.post(this.url+'/edit',data);
  }

  //Save edited details
  saveEditDetails(customer: Object){
    return this.http.put(this.url+'/editData',customer);
  }
}