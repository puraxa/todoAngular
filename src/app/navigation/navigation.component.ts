import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(public auth:AuthService,private router:Router,private http:HttpClient) { }
  ngOnInit() {
    if(this.auth.loggedIn==undefined){
      this.auth.checkAuth().then(data => {
        if(!this.auth.loggedIn){
          this.router.navigate(['login']);
        }
      }).catch(err => console.log(err));
    }else{
      if(!this.auth.loggedIn){
        this.router.navigate(['login']);
      }
    }
  }
  logout(){
    this.http.post('https://europe-west1-todolistpura.cloudfunctions.net/logout',{token:localStorage.getItem('token')}).toPromise()
      .then(data => {
        localStorage.clear();
        this.auth.loggedIn = false;
        this.router.navigate(['login']);
      })
      .catch(err => {
        console.log(err);
      })
  }
}
