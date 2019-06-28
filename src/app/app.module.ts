import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctionsModule, FUNCTIONS_ORIGIN, FUNCTIONS_REGION } from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TodolistComponent } from './todolist/todolist.component';
import { NavigationComponent } from './navigation/navigation.component';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet'; 

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    TodolistComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireFunctionsModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    MatBottomSheetModule
  ],
  providers: [
    {provide:FUNCTIONS_ORIGIN,useValue:'http://localhost:5000'},
    { provide: FUNCTIONS_REGION, useValue: 'europe-west1' },
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
