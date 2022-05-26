import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { environment } from "src/environments/environment";
import { loginForm } from "../models/loginModel";
<<<<<<< HEAD
=======
import { AlertComponent } from "../alert/alert.component";
import { LogpopupComponent } from "../logpopup/logpopup.component";
import {MatDialog} from '@angular/material/dialog';
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})

export class LoinService {
  userDetails: object;
  private cus_id: string;
  private token: string;
  private msg: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
   errorMessage: string = null;


  constructor(private http: HttpClient, private router: Router, public dialog: MatDialog) { }


getToken() {
  return localStorage.getItem("token");
  //return this.getAuthData();
  //return this.token;
  }

getIsAuth() {
    return this.isAuthenticated;
  }

getUserId() {
    return this.cus_id;
  }

getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

getUserDetails(){
    return this.userDetails;
  }



userLogin(data: loginForm){
   const authData: loginForm = {username: data.username, password: data.password}

  this.http.post<{message: string, token: string, expiresIn: number, data: object}>(`${apiUrl}/login`,authData)
  .subscribe(response =>{

    const msg = response.message;
    const token = response.token;
    this.userDetails = response.data;
    this.token = token;

    if(token){
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.cus_id = response.data[0].cus_id;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1
            );
      console.log(expirationDate);

      this.saveAuthData(token, expirationDate, this.cus_id);
      this.router.navigate(["/home"]);
<<<<<<< HEAD
=======
    }else{
      console.log(msg);
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9
    }
  },(err) => {
    this.authStatusListener.next(false);
    this.errorMessage = err.error.message;
<<<<<<< HEAD
=======
    this.dialog.open(LogpopupComponent, {data: {message: this.errorMessage}});

>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9
  }
)}

getError(){
  return this.errorMessage;
}


autoAuthUser() {
  const authInformation = this.getAuthData();
  if (!authInformation) {
    return;
  }
  const now = new Date();
  const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
  if (expiresIn > 0) {
    this.token = authInformation.token;
    this.isAuthenticated = true;
    this.cus_id = authInformation.cus_id;
    this.setAuthTimer(expiresIn / 1);
    this.authStatusListener.next(true);
  }
}

logout() {

  this.token= null;
  this.isAuthenticated = false;
  this.authStatusListener.next(false);
  this.cus_id = null;
  clearTimeout(this.tokenTimer);
  this.clearAuthData();
  this.router.navigate(['/']);
}

private setAuthTimer(duration: number) {
  this.tokenTimer = setTimeout(() => {
    this.logout();
  }, duration * 1);
}

private saveAuthData(token: string, expirationDate: Date, cus_id: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("expiration", expirationDate.toISOString());
  localStorage.setItem("cus_id", cus_id);
}
private clearAuthData() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("cus_id");
}
private getAuthData() {
  const token = localStorage.getItem("token");
  const expirationDate = localStorage.getItem("expiration");
  const cus_id = localStorage.getItem("cus_id");
  if (!token || !expirationDate) {

    return;
  }
  return {
    token: token,
    expirationDate: new Date(expirationDate),
    cus_id: cus_id
  };
}



}
