import { Component } from '@angular/core';
import { AuthService } from '../auth.service';// Import the AuthService you will create
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { initializeApp, getApp, getApps } from 'firebase/app';
// import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from 'firebase/auth';

import { CommonModule } from '@angular/common';
import { ApiserviceService } from '../apiservice.service';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule,HttpClientModule],
  
  providers: [ApiserviceService] ,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // phoneNumber: string = '';
  verificationCode: string = ''; // OTP
  showOTPForm: boolean = false;
  showSignUpCard: boolean = false;
userRole:any=[]

newUser:boolean=false;
roleModalVisible = false;


  isSignIn = true; // Default to Sign In
  isSignUp = false;
  isforgotvisible=true



  username: any;
  email: string = '';
  password: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  confirmPassword: any;
  selectedRole: string   = '';


  // for signup error 
  emailError: string = '';
  passwordError: string = '';
  fieldError: string = '';
  roleError: string = '';
  login_error:string=' '
  submit_btn_visibl=true


  constructor(private authService: AuthService,private router:Router, private apicall:ApiserviceService) {
    this.apicall.get_UserRole().subscribe(
      (response: any) => {
          if (response) {
              this.userRole = response; // or whatever structure you're expecting
          }
      },
      (error: any) => {
          console.log("Error fetching user role:", error);
         
      }
  );
  



    
  }

  showSignIn() {
    this.isSignIn = true;
    this.isSignUp = false;
  }

  showSignUp() {
    this.isSignIn = false;
    this.isSignUp = true;
  }

  onSubmit() {
    // Handle sign in logic
    console.log('Signing in with:', this.email, this.password);
    if (!this.email || !this.password) {
      this.login_error = 'All fields are required';
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
      this.login_error = 'Invalid email format';
      return;
    }
    this.authService.signIn(this.email,this.password)
      .then((userCredential) => {
        console.log("Login successful:", userCredential.user);
      })
      .catch((error) => {
        if (error.code === 'auth/user-not-found') {
          alert("No account found with this email. Please sign up.");
        } else if (error.code === 'auth/wrong-password') {
          alert("Incorrect password. Please try again.");
        } else {
          alert("An error occurred: " + error.message);

          // An error occurred: Firebase: Error (auth/invalid-credential).
        }
      });




  }

  toggleSignUp() {
    // Toggle the sign-up card
    this.showSignUpCard = !this.showSignUpCard;
  }


// OTP send

  // onSubmit() {
  //   if (this.phoneNumber) {
  //     this.authService.sendOTP(this.phoneNumber).then(() => {
  //       this.showOTPForm = true; // Show OTP form after sending the OTP
  //     }).catch(error => {
  //       console.error("Error sending OTP: ", error);
  //     });
  //   }
  // }

  // verifyOTP() {
  //   if (this.verificationCode) {
  //     this.authService.verifyOTP(this.verificationCode)
  //       .then(result => {
  //         console.log("User signed in successfully: ", result.user);
  //         // Handle successful login, e.g., redirect to another page
  //       })
  //       .catch(error => {
  //         console.error("Error verifying OTP: ", error);
  //       });
  //   }
  // }


  onSignUp()
  {
    this.resetErrors(); // Clear previous errors before checking

    // Check if any field is empty
    if (!this.username || !this.signupEmail || !this.signupPassword || !this.confirmPassword) {
      this.fieldError = 'All fields are required';
      return;
    }

    // Validate email format
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
    if (!this.selectedRole || this.selectedRole === '') {
      this.roleError = 'Please select a role';
      return;
    }


    // If all checks pass, proceed with the sign-up process
    // console.log('Form is valid. Proceed with sign-up.',this.username, this.signupEmail,this.selectedRole, false,"own",this.confirmPassword);



    // this.apicall.insert_user( this.username, this.signupEmail,this.selectedRole, false,"own",this.confirmPassword).subscribe((result:any)=>{
    //   if(result)
    //   {

        
    //     this.authService.createEmail(this.signupEmail,this.confirmPassword).then((userCredential) => {
    //       console.log("Login successful:", userCredential.user);
    //     })
    //     .catch ((error)=>{
    //       if (error.code === 'auth/email-already-in-use') {
           
    //       } else {
    //         alert("An error occurred: " + error.message);
    //       }
    //     })


    //     console.log("result",result)
    //     if(result.message==="Email already exists")
    //     {

    //     }

    //     alert('You have successfully registered. Please sign in.');
    //     this.submit_btn_visibl=!this.submit_btn_visibl

    //   }

    // },(error:HttpErrorResponse)=>{
    //   if (error.status === 500) {
    //     alert('Internal server error. Please try again later.');
    //   } else {
    //     alert('An unexpected error occurred. Please try again.');
    //   }
    // })


    this.apicall.insert_user(this.username, this.signupEmail, this.selectedRole, false, "own", this.confirmPassword).subscribe(
      (result: any) => {
        if (result) {
          // Check if the email already exists in MySQL
          if (result.message === "Email already exists") {
            alert("Email already exists in MySQL database. Please try logging in.");
            return; // Stop further processing if the email already exists in MySQL
          }
    
          // Proceed to create user in Firebase
          this.authService.createEmail(this.signupEmail, this.confirmPassword).then((userCredential) => {
            console.log("Registration successful:", userCredential.user);
    
            // After successful Firebase registration, you can proceed with any further logic here
            alert('You have successfully registered. Please sign in.');
            this.submit_btn_visibl = !this.submit_btn_visibl;
          })
          .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
              // If email already in use, notify the user
              alert("Email already exists in Firebase. Please try logging in.");
            } else {
              // Handle other Firebase errors
              alert("An error occurred: " + error.message);
            }
          });
        }
      },
      (error: HttpErrorResponse) => {
        // Handle server errors
        if (error.status === 500) {
          alert('Internal server error. Please try again later.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      }
    );
    




  }
  resetErrors() {
    this.emailError = '';
    this.passwordError = '';
    this.fieldError = '';
    this.roleError=''
    this.login_error=''
  }



  signInWithGoogle()
  {
    this.authService. googleSignIn().then(result => {
      if(result)
      {
        console.log("User signed in successfully: ", result);
        // Handle successful login, e.g., redirect to another page
        sessionStorage.setItem('displayName', result.user.displayName || 'Guest'); // Default value if null

        // Optionally store other user information
        sessionStorage.setItem('uid', result.user.uid);
        sessionStorage.setItem('email', result.user.email || ''); // Default to empty string if null
        sessionStorage.setItem('photoURL', result.user.photoURL || ''); // Default to empty string if null
        sessionStorage.setItem('displayName',result.user.displayName||'')
        sessionStorage.setItem('emailVerified', JSON.stringify(result.user.emailVerified))
        


        const tokenResponse = (result as any)._tokenResponse; 
        const isNewUser = tokenResponse?.isNewUser;


        if(isNewUser)
        {
          this.newuserstatus();          
        }
        else{
          this.router.navigate(['/home']);
        }


        
      }
     
    })
    .catch(error => {
      console.error("Error verifying OTP: ", error);
    });
  }


  forgotPassword()
  {
    if(this.email!='' || this.email || this.email===undefined)
    {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(this.email)) {
    alert('Invalid email format');
      return;
    }
    else{

      this.apicall.sendForgotmail(this.email,' '+sessionStorage.getItem('displayName') || '').subscribe((result:any)=>{

        if(result && result.message==="Reset email sent successfully")
        {
          alert("Password reset email sent successfully. Please check your inbox.");

        }
      },(error:any)=>{})
    }
    }else{
      alert('Please Enter Email');
    }
  }


  onstoreRole()
  {

    sessionStorage.setItem('Role',this.selectedRole)
   
    // result.user.displayName, result.user.email, result.user.emailVerified
    const name=sessionStorage.getItem('displayName')
    const email=sessionStorage.getItem('email')
    const email_verified=JSON.parse(sessionStorage.getItem('isLoggedIn') || 'false');

    
    if(this.selectedRole)
    {
       this.newUser=!this.newUser;
       this.apicall.insert_user( name, email,this.selectedRole, false,"other",null).subscribe((result:any)=>{
        if(result)
        {
          if(result.message=="Email already exists")
          {

            let val=result.loginoption ||''
            if(val=="other")
            {
              this.isforgotvisible=true
              alert("You can continue with Google or reset your password.");

            }else{
              this.isforgotvisible=true
              alert("Continue with your email and password or reset your password.");
            }
        
        }
        else if(result.message=="Data added successfully")
        {
          this.router.navigate(['/home']);
        }
          }
          
  
      },(error:any)=>{
        console.log("))))",error)
      })
    }
    else{
      this.roleError = 'Please select a role';
    }
    
  }
  

  newuserstatus()
  {
    this.newUser=!this.newUser;
  }
}