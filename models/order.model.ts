export class orderDetails {
  cus_id:number;
  paymentType:string;
  HotelNumber:number;
  sum: number;
  items:Array<object>;
  constructor(cus_id:number,paymentType:string, HotelNumber:number,sum:number, items:Array<object>){
    this.cus_id = cus_id;
    this.paymentType = paymentType;
    this.HotelNumber = HotelNumber;
    this.sum = sum;
    this.items = items;
  }

}
