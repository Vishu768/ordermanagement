import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { orderDetails } from '../models/order.model';


const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

private orders:any;


constructor(private http: HttpClient, private router: Router) { }


getHotelName(){
  return this.http.get(`${apiUrl}/getHotelName`);
}

getFood(hotelName: string){
  const hotelData ={hotelName: hotelName }
  return this.http.post(`${apiUrl}/getFood`,hotelData);
}

order(order: object){
  return this.http.post(`${apiUrl}/createorder`,order);
}

placeOrder(data: object){
   this.orders =JSON.stringify(data);
    }


getOrders(){
    return this.orders;
  }

}
