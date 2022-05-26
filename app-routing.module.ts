import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PayComponent } from './pay/pay.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'pay', component: PayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
