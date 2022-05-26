import { Component, OnInit } from '@angular/core';
import { LoinService } from '../login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private service: LoinService) { }

  ngOnInit(): void {
  }

  onLogout() {
    this.service.logout();
  }

}
