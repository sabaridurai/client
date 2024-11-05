import { INavbarData } from "./helper";




export const navbarDataAdmin: INavbarData[] = [
    {
        routeLink: '/afterlogin/home',
        icon: 'fas fa-home', // Changed to 'fas' for solid icons
        label: 'Home'
    },
    {
        routeLink: '/afterlogin/additem',
        icon: 'fas fa-plus', // Changed to 'fas'
        label: 'Add Item'
    },
    {
        routeLink: '/pages', // Ensure this is a valid route
        icon: 'fas fa-file', // Changed to 'fas'
        label: 'Pages' // Capitalized for consistency
    },
    {
        routeLink: '/media', // Ensure this is a valid route
        icon: 'fas fa-camera', // Changed to 'fas'
        label: 'Admin' // Consider renaming for clarity
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