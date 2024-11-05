/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule here
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations'; // Alternative method to provide animations
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, {
  providers: [provideAnimations(), ...appConfig.providers] // Use provideAnimations here
}).catch((err) => console.error(err));
