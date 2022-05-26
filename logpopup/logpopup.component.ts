import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-logpopup',
  templateUrl: './logpopup.component.html',
  styleUrls: ['./logpopup.component.css']
})
export class LogpopupComponent{

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}) { }



}
