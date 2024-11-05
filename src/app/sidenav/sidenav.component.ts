import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fadeInOut, INavbarData } from './helper'; // Ensure fadeInOut is defined correctly
import { getNavbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { isPlatformBrowser } from '@angular/common';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, SublevelMenuComponent, CommonModule],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(2turn)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class SidenavComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData: INavbarData[] = [];
  role: string = '';
  multiple: boolean = false;
  C_name_FirstLetter = "S";
  C_name = "sabari";
  imageUrl:any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(public router: Router, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.C_name = 'LorryLink.com';
      this.imageUrl=sessionStorage.getItem('photoURL');

      this.C_name_FirstLetter = this.C_name.charAt(0);
    } else {
      // Set default values or handle server-side logic if needed
      this.C_name = 'LorryLink';
      this.C_name_FirstLetter = 'L';
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const rolekey = 'Role';
      const storedValue = sessionStorage.getItem(rolekey);
      if (storedValue !== null) {
        this.role = storedValue;
      }
    }
    this.navData = getNavbarData(this.role);
    this.screenWidth = isPlatformBrowser(this.platformId) ? window.innerWidth : 0;
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    if (this.collapsed === false) {
      this.closeSidenav();
    }
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(item: INavbarData): void {
    this.shrinkItems(item);
    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  shrinkItems(item: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
  }
}
