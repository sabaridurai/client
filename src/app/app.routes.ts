import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';

export const routes: Routes = [

    {path:'', redirectTo:'login',pathMatch:'full'},
    {path:'login', component:LoginComponent},
    {path:'home', component:HomeComponent},
    {path:'header', component:HeaderComponent},
    {path:'reset',component:ResetpasswordComponent}
];
