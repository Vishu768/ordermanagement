import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.css']
})
export class CounterComponent {
  value : number = 0;
  @Output() counterValue : EventEmitter<number> = new EventEmitter<number>();


  plus(){
    if(this.value <= 10){
      this.counterValue.emit(++this.value);
    }
  }
  minus(){
    if(this.value > 0 ){
      this.counterValue.emit(--this.value);
    }
  }

}
