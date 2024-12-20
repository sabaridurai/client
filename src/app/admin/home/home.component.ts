import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../sidenav/sidenav.component';
import { BodyComponent } from "../../body/body.component";
import { ContentareaComponent } from "../../contentarea/contentarea.component";
interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FormsModule, RouterOutlet, BodyComponent, SidenavComponent, ContentareaComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
