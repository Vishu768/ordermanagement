import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './login/auth.interceptor';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';



import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatDividerModule} from '@angular/material/divider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';

import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { PayComponent } from './pay/pay.component';
import { CounterComponent } from './counter/counter.component';

import { AlertComponent } from './alert/alert.component';
<<<<<<< HEAD
=======
import { LogpopupComponent } from './logpopup/logpopup.component';
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    PayComponent,
    CounterComponent,
<<<<<<< HEAD
    AlertComponent
=======
    AlertComponent,
    LogpopupComponent
>>>>>>> 3f751873c713f89481dab1ff8a4ce2d05d1192f9

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatGridListModule,
    MatListModule,
    MatInputModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatRadioModule


  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
