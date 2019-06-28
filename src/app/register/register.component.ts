import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  error:string;
  spinner: boolean;
  constructor(private router:Router,private http:HttpClient, private auth:AuthService) { }
  async ngOnInit() {
    try {
      this.spinner = false;
      this.auth.loggedIn = await this.auth.checkAuth();
      if(this.auth.loggedIn){
        await this.router.navigate(['todolist']);
      }
    } catch (err) {
      console.log(err);
    }
  }
  onSubmit(form:any): void{
    this.spinner = true;
    if(form.password != form.confirmPassword){
      this.error = "Passwords dont match";
      this.spinner = false;
      return;
    }
    this.http.post("https://europe-west1-todolistpura.cloudfunctions.net/register",JSON.stringify(form)).subscribe((data)=>{
      this.router.navigate(['login']);
    },err=>{
      this.spinner = false;
      this.error = err['error'].message;
    });
  }
}