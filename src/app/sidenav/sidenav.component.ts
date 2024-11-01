import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { fadeInOut, INavbarData } from './helper'; // Ensure fadeInOut is defined correctly
import { getNavbarData } from './nav-data';
import { CommonModule } from '@angular/common';
import { SublevelMenuComponent } from './sublevel-menu.component';
import {  NoopAnimationsModule } from '@angular/platform-browser/animations';


interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule, SublevelMenuComponent, CommonModule,],
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
  C_name_FirstLetter="S"
  C_name="sabari"




  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(public router: Router) {}

  ngOnInit(): void {
    // Check if running in a browser
    if (typeof window !== 'undefined') {
      const rolekey = 'Role';
      const storedValue = sessionStorage.getItem(rolekey);
      if (storedValue !== null) {
        this.role = storedValue;
      }
    }
    this.navData = getNavbarData(this.role);
    this.screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0; // Set screenWidth only if in browser
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
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


      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }

    }
  }
}
