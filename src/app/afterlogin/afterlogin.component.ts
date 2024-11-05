import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SidenavComponent } from "../sidenav/sidenav.component";
import { BodyComponent } from "../body/body.component";
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-afterlogin',
  imports: [SidenavComponent, BodyComponent, CommonModule,RouterModule],
  standalone: true,
  template: `
    <app-sidenav (onToggleSideNav)="onToggleSideNav($event)"></app-sidenav>
    <app-body [collapsed]="isSideNavCollapsed" [screenWidth]="screenWidth">
      <router-outlet></router-outlet>
    </app-body>
  `,
})
export class AfterloginComponent implements OnInit {
  title = 'sidenav-with-multilevel-menu';
  isSideNavCollapsed = false;
  screenWidth = 0;
issidenav=false;

  constructor(private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object // Injecting platform ID for browser checks
  ) {


  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const rolekey = 'Role';
      const storedValue = sessionStorage.getItem(rolekey);
      console.log("__--called",this.issidenav);
      
      if (storedValue === 'Ordinary User') {
       
        this.router.navigate(['home'], { relativeTo: this.route });
      } else {
        // this.issidenav=!this.issidenav
        alert("Your login credentials are not available. Please Login");
        this.router.navigate(["login"]);
      }
    }
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
    this.cdr.detectChanges();
  }
}
