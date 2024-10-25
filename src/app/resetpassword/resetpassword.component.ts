import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from '../apiservice.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resetpassword',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './resetpassword.component.html',
  styleUrl: './resetpassword.component.css'
})
export class ResetpasswordComponent {
  token: string ='';

  emailError: string = '';
  passwordError: string = '';

  fieldError: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  confirmPassword: any;

  constructor(private route: ActivatedRoute,private apicall:ApiserviceService,private router:Router) {}

  ngOnInit(): void {
    // Get the 'token' parameter from the URL
    this.route.queryParamMap.subscribe(params => {
      this.token = params.get('token')||'';
      console.log('Token:', this.token); // For debugging purposes
    });
  }



  onSignUp()
  {
    this.resetErrors(); // Clear previous errors before checking
   // Validate email format

   if ( !this.signupEmail || !this.signupPassword || !this.confirmPassword) {
    this.fieldError = 'All fields are required';
    return;
  }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.signupEmail)) {
      this.emailError = 'Invalid email format';
      return;
    }
    // Check if passwords match
    if (this.signupPassword !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      return;
    }
    this.apicall.reset_Password( this.token,this.signupEmail,this.confirmPassword).subscribe((result:any)=>{
      if(result)
      {
        if(result.success === "Password updated successfully"){
          // Handle success
          console.log('Password updated successfully:', result);
          alert('Password updated successfully');
          this.signupEmail=""
          this.signupPassword=""
          this.confirmPassword=""
          }
          else{
            alert(result.error)
          }
      }

    }, (error: HttpErrorResponse) => {
      // Handle error
      console.error('Error updating password:', error);

      if (error.status === 404) {
        alert('Email not found or token is invalid');
      } else if (error.status === 500) {
        alert('Internal server error. Please try again later.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    })
  }
  resetErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.fieldError='';
  }

  toggleSignUp() {
    this.router.navigate(['/login']);
  }
}