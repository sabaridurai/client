import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environmentprod } from '../environments/environment.prod'; // Adjust the path if needed

@Injectable({
  providedIn: 'root'
})
export class ApiserviceService {



  public apiURL = environmentprod.Local_serverURL + 'api/';

  constructor(private http: HttpClient) {}




  reset_Password(token: string, email: string, password: string): Observable<any> {
    const body = { token, email, password };
    console.log("api called", token, email, password);
    
    return this.http.post(`${this.apiURL}resetpassword`, body);
  
  }

  
  sendForgotmail(email: string, name: string): Observable<any> {
    console.log("Forgot password request for email:", email, "and name:", name);
    
    // Assuming your API expects a GET request with the email and name as query parameters
    return this.http.get(`${this.apiURL}forgotpassword?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
  }
  

  get_UserRole(): Observable<any> {
    return this.http.get(this.apiURL + 'get_UserRole'); // Ensure the URL is correct
  }

  get_UserName(): Observable<any> {
    return this.http.get(this.apiURL + 'get_UserName'); // Ensure this is the right endpoint
  }
  insert_user(name:any,email:any,role:any,emailverified:boolean,option:any,password:any):Observable<any>{
    
    console.log("api called insert",name, email,role, emailverified,option,password)
    const data={name,email,role,emailverified,option,password}

    return this.http.put(this.apiURL + 'insert_user',data);
  }


}
