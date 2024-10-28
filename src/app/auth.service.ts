// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { initializeApp, getApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup, 
  ConfirmationResult, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  createUserWithEmailAndPassword,
  confirmPasswordReset

} from 'firebase/auth';
import { environment } from '../environments/environment';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth(this.getFirebaseApp());
  confirmationResult: ConfirmationResult | null = null;

  private getFirebaseApp() {
    if (!getApps().length) {
      return initializeApp(environment.firebase);
    }
    return getApp();
  }

  constructor() {}




  changepassword(token:string,password:string)
  {
return confirmPasswordReset(this.auth,token,password)
  }




// Email and password register

  async createEmail( email:string,password:string)
{
 return await createUserWithEmailAndPassword(this.auth, email, password);
}

  // Email and Password Sign-In
  signIn(email: string, password: string) {
    console.log("called auth",this.auth, email, password);
    
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Google Sign-In
  googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  setupRecaptcha(containerId: string) {
    // Create a new instance of RecaptchaVerifier
    window.recaptchaVerifier = new RecaptchaVerifier(this.auth,containerId, {
      size: 'invisible', // or 'normal'
      callback: (response: any) => {
        console.log("reCAPTCHA solved.");
        // reCAPTCHA solved - will proceed with submit function
      },
      'expired-callback': () => {
        console.log("reCAPTCHA expired.");
        // Response expired. Ask user to solve reCAPTCHA again.
      }
    }); // Pass the Firebase Auth instance as the third argument
  }
  
  sendOTP(phoneNumber: string) {
    this.setupRecaptcha('recaptcha-container'); // Make sure this matches your HTML
    const appVerifier = window.recaptchaVerifier;

    return signInWithPhoneNumber(this.auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult; // Store the confirmation result for later use
        console.log("OTP sent successfully.");
      })
      .catch((error) => {
        console.error("Error sending OTP: ", error);
      });
  }

  verifyOTP(verificationCode: string) {
    if (this.confirmationResult) {
      return this.confirmationResult.confirm(verificationCode)
        .then((result) => {
          console.log("OTP verified successfully: ", result.user);
          return result; // Return user info after successful verification
        })
        .catch((error) => {
          console.error("Error verifying OTP: ", error);
          throw error; // Rethrow error for further handling
        });
    } else {
      throw new Error('No confirmation result available. Please send OTP first.');
    }
  }
}
