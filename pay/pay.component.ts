import { Component, OnInit, Input, Output, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { Animation } from '../animation/animation';
import {MatDialog} from '@angular/material/dialog';

import { orderDetails } from '../models/order.model';



@Component({
  selector: 'pay-component',
  templateUrl: './pay.component.html',
  styleUrls: ['../home/home.component.css'],
  animations: [Animation]
})
export class PayComponent implements OnInit {

  orderData :orderDetails[] = [];
  successMessage: string;
  isShown: boolean = false ;
<<<<<<< HEAD
  isButton: boolean = false;
=======
  isButton: boolean = true;
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9
  value: string;
  orders = []
  error: any;

  cus_id:number;
  HotelNumber:number;
  items:Array<object>;

  placeOrder:object;


  constructor(private router: Router,
              private service: HomeService,
              private dialog: MatDialog) {}

ngOnInit() {
   this.orders = [JSON.parse(this.service.getOrders())];
  let data = this.orders;
  for(let values of data){
    this.items = values.items;
    this.HotelNumber = values.HotelNumber;
    this.cus_id = values.cus_id;
  }

}


 payDetails(val: string){

  let Pay  = val;
  if(!!Pay){
    this.placeOrder = {cus_id:this.cus_id, paymentType:val,HotelNumber:this.HotelNumber,items:this.items};
    const orderObject = this.placeOrder;
    this.service.order(orderObject).subscribe((res:any) => {
    this.error = res.message;
  })

  }else {
      this.error ="Please select Payment Method"
  }

  }

  close(){
    this.error =""
  }

  back(){
    this.router.navigate(['/home']);
<<<<<<< HEAD
=======
  }

  button(){
    this.isButton = false;
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9
  }

}
