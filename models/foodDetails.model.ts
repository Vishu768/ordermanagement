export class foodSample {
  foodNmae: string;
  food_id:string;
  quantity: number;
  unitId: number;
  buyEach: number;

  constructor(foodNmae: string, food_id:string, buyEach: number){
    this.foodNmae = foodNmae;
    this.food_id = food_id;
    this.quantity = 0;
    this.unitId = 7;
    this.buyEach = buyEach;
  }

}
