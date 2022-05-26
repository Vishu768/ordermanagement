import { Injectable } from '@angular/core';
import { LoinService } from './login.service';
import { HttpInterceptor, HttpRequest,HttpHandler } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private service:LoinService){}

  intercept (req: HttpRequest<any>, next: HttpHandler){
    const authToken = this.service.getToken();
    //  console.log(authToken);
   req = req.clone({
    setHeaders: {
      authenticate: `${authToken}`
    }
  });


    return next.handle(req)
  }

}
