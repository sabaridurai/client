import { Component } from '@angular/core';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;
  profile:any

constructor()
{
  // this.profile=sessionStorage.getItem('photoURL') || 'client\src\assets\logo.png'
  this.profile='https://github.com/sabaridurai/client/blob/master/src/assets/logo.png'
  console.log("profile",this.profile);
  
}
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}
