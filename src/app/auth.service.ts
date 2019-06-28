import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn;
  constructor(private http: HttpClient) { 
    
  }
  checkAuth = async() => {
    try{
      let response = await this.http.post('https://europe-west1-todolistpura.cloudfunctions.net/auth',{token:localStorage.getItem('token')}).toPromise();
      this.loggedIn = response['authorized'];
      return response['authorized'];
    }catch (err){
      return err.error.authorized;
    }
  }
}
