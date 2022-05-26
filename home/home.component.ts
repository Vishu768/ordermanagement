import { Component, OnInit } from '@angular/core';


import { HomeService } from './home.service';
import { LoinService } from '../login/login.service';
import {MatDialog} from '@angular/material/dialog';
import { hotelNames } from '../models/hotelName.model';
import {  foodSample } from '../models/foodDetails.model';
import { Router } from '@angular/router';
import { Animation } from '../animation/animation';
import { orderDetails } from '../models/order.model';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [Animation ]

})
export class HomeComponent implements OnInit {

constructor(private service:HomeService,
    public dialog: MatDialog,
    private logservice: LoinService,
    private router: Router
     ) { }

isShown: boolean = false ;
isButton: boolean = false;
Name: object;
responseName: hotelNames[]=[];
foodDetails: foodSample[];
orderDetail: orderDetails[];
orderData: object;
sum = 0;
cus_id : number;
HotelNumber: number;
error:any;
shareData: object;




ngOnInit(): void {
  this.Name = this.logservice.getUserDetails();
  this.service.getHotelName().subscribe((res: any) => {
  this.responseName = res.data;
    });

  }

hotelSelect(val: string, hotel:number, cusDetails: Array<any>): void{

  this.foodDetails =[];
  for(let cus_id of cusDetails){
    this.cus_id = cus_id.cus_id;

  }
  this.HotelNumber= hotel;
  this.service.getFood(val).subscribe((res: any) =>{
  let responseData = res.data;
  for(let getFood of responseData){
    this.foodDetails.push( new foodSample(getFood.foodNmae, getFood.food_id,getFood.buyEach));
      }
  });

  this.isButton = true;
  }


quantity(foodDetail: Array<any>){
  let sum1 = 0;
  for( let data of foodDetail){
    let total = data.quantity * data.buyEach;
    sum1 += total;
    this.sum = sum1;
    }
  }

placeOrder(orders: Array<any>){

  const removeData = orders.filter((res: { quantity: number; }) => res.quantity !== 0);
  if(removeData.length === 0){
    this.error ="Please select Food quantity";
  }else{
  this.orderData = removeData;
  this.shareData = { cus_id:this.cus_id, HotelNumber:this.HotelNumber, sum: this.sum, items:this.orderData}
  this.service.placeOrder(this.shareData);
  this.router.navigate(['/pay']);
  }
}

close(){
  this.error =""
}

}
