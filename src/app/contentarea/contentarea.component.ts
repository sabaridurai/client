import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-contentarea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contentarea.component.html',
  styleUrl: './contentarea.component.css'
})
export class ContentareaComponent {
  items = Array(6).fill({});
  onButtonClick() {
    // Handle the button click event
    console.log('Button clicked!'); // Replace with your desired action
  }
}
