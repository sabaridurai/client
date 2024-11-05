import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  isFullscreen: boolean = false; // Track full-screen state
  isNotificationEmpty: boolean = false;
  LoginedName: string = "UserName";

  constructor(private router: Router) {
    // Check if running in browser context
    if (typeof window !== 'undefined' && sessionStorage) {
      this.LoginedName = sessionStorage.getItem('displayName') || "UserName";
    }
  }

  OnLogout() {
    this.router.navigate(['/login']);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Request to enter full-screen mode
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen = true; // Update state
      }).catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      // Exit full-screen mode
      document.exitFullscreen().then(() => {
        this.isFullscreen = false; // Update state
      });
    }
  }
}
