import { INavbarData } from "./helper";




export const navbarDataAdmin: INavbarData[] = [
    {
        routeLink: '/afterlogin/admindashboard',
        icon: 'fal fa-home',
        label: 'Home'
    },
   
    {
        routeLink: '/afterlogin/software_admin_dashboard_user_manage',
        icon: 'fal fa-user',
        label: 'User Management'
    },
    
    {
        routeLink: 'pages',
        icon: 'fal fa-file',
        label: 'pages'
    },
    {
        routeLink: 'media',
        icon: 'fal fa-camera',
        label: 'admin'
    },
    
];
export function getNavbarData(User: String): INavbarData[] {
console.log("**&&&&&&&&"+User)

    if(User=="Ordinary User"){
        // console.log("________")
        return  navbarDataAdmin;
    }
   
     else{
        console.log("..........+.",User)
            return navbarDataAdmin ;
        
     }
}