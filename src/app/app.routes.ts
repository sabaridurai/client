import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './admin/home/home.component';
import { HeaderComponent } from './header/header.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { AfterloginComponent } from './afterlogin/afterlogin.component';
import { AddItemComponent } from './admin/add-item/add-item.component';
import { DefaultLayoutComponent } from './layout/default-layout/default-layout.component';

export const routes: Routes = [


    // {
    //     path: '',
    //     redirectTo: 'dashboard',
    //     pathMatch: 'full'
    //   },
      {
        path: '',
        component: DefaultLayoutComponent,
        data: {
          title: 'Home'
        },
        children: [
          {
            path: 'dashboard',
            loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
          },
          {
            path: 'theme',
            loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
          },
          {
            path: 'base',
            loadChildren: () => import('./views/base/routes').then((m) => m.routes)
          },
          {
            path: 'buttons',
            loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
          },
          {
            path: 'forms',
            loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
          },
          {
            path: 'icons',
            loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
          },
          {
            path: 'notifications',
            loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
          },
          {
            path: 'widgets',
            loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
          },
          {
            path: 'charts',
            loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
          },
          {
            path: 'pages',
            loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
          }
        ]
      },

    {path:'', redirectTo:'login',pathMatch:'full'},
    {path:'login', component:LoginComponent},
  
    {path:'header', component:HeaderComponent},
    {path:'reset',component:ResetpasswordComponent},
   
    {path:'afterlogin', component:AfterloginComponent,
        children: [ 
            {
                path: 'home',
                loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
              },
            {path:'additem', component:AddItemComponent}
        ]}
          
       
            
];
