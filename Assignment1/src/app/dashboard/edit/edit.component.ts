import { Component, OnInit } from '@angular/core';
import { MyserviceService } from 'src/app/myservice.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from '../../local-storage.service';
import { ConfirmedValidator } from '../../confirm-password';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

  public token;
  constructor(
    private myservice: MyserviceService,
    private formbuild: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private storageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.userDetails();
  }

  //fetching user details
  userDetails() {
    //if keep me sign in checked
    if (this.storageService.getToken()) {
      this.token = JSON.parse(this.storageService.getToken())
    }
    //if keep me sign in not checked
    if (this.storageService.getTokenSession()) {
      this.token = JSON.parse(this.storageService.getTokenSession())
    }

    let tokenObj = { 'token': this.token }
    this.myservice.userDashboard(tokenObj)
      .subscribe(
        result => {
          this.loadData(result);
        }
      )
  }

  editForm: FormGroup;
  //load data into editUser from
  loadData(result) {
    this.editForm = this.formbuild.group({
      date: [result.date, [Validators.required]],
      gender: [result.gender, [Validators.required]],
      oldPassword: ['', [Validators.required, Validators.pattern("([a-zA-Z]{1}([a-zA-Z0-9-\W]{6})([0-9]{1}))")]],
      password: ['', [Validators.required, Validators.pattern("([a-zA-Z]{1}([a-zA-Z0-9-\W]{6})([0-9]{1}))")]],
      confirmPassword: ['', [Validators.required]],
      address1: [result.address1, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      address2: [result.address2, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      city: [result.city, [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      state: [result.state, [Validators.required]],
      zip: [result.zip, [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      name: [result.name, [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      phone: [result.phone, [Validators.required, Validators.pattern("^[6-9][0-9]{9}")]],
      email: [result.email, [Validators.required, Validators.minLength(6), Validators.maxLength(30), Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+[.][a-z]{2,4}$")]],
    },
    {
      validator: ConfirmedValidator('password','confirmPassword')
    });
  }

  saveDetails() {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return false;
    }

    this.myservice.saveEditDetails(this.editForm.value)
      .subscribe(
        res => {
          this.toastr.success(JSON.stringify(res), 'Success!');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        },
        err => {
          console.log(err);
          
          this.toastr.error(JSON.stringify(err.error.msg), 'Failure!');
        })
  }
}