import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import { LoinService } from './login.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error: any

  constructor( private router: Router, private service:LoinService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(2),Validators.maxLength(20)])
    })

  }

  onSubmit(){
    this.submitted = true;
    if(this.loginForm.valid){
<<<<<<< HEAD
      this.service.userLogin(this.loginForm.value);
      this.error = this.service.getError();
=======
      // this.error ="";
      this.service.userLogin(this.loginForm.value);
      // this.error = this.service.getError();
      // console.log(this.error);

>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9
    }
  }
  onReset(){
    this.submitted = false;
    this.loginForm.reset();
  }

  close(){
    this.error =""
  }

}
