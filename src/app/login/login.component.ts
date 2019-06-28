import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error:string;
  spinner:boolean;
  constructor(private router:Router,private http:HttpClient, public auth:AuthService) { }
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
  onSubmit(form: any){
    if(!form.email || !form.password){
      this.error = 'One or more fields missing!';
      return;
    }
    this.spinner = true;
    this.http.post('https://europe-west1-todolistpura.cloudfunctions.net/login',JSON.stringify(form)).toPromise().then(data => {
      localStorage.setItem('token',data['jwt']);
      this.auth.loggedIn = true;
      this.router.navigate(['todolist']);
    }).catch(err => {
      this.error = err['error'].message;
      this.spinner = false;
    });
  }

}