//  Import all the pages
import React from 'react';
import { ApparelPage, AdminPage, AuthenticationPage, HomePage, ProductTemplatePage, ProfilePage, ResellerListPage, ResellerTemplatePage, SneakersPage } from '../pages';


const ROUTES = (routeName="", props = {}) => {
    switch(routeName) {
        case "homePage":
            return HomePage;
        case "resellerListPage":
            return ResellerListPage;
        case "resellerTemplatePage":
            return ResellerTemplatePage;
        case "sneakersPage":
            return SneakersPage;
        case "apparelPage":
            return ApparelPage;
        case "productTemplatePage":
            return ProductTemplatePage;
        case "profilePage":
            return ProfilePage;
        case "authenticationPage":
            return AuthenticationPage;
        case "adminPage":
            return AdminPage;
        default: 
            return () => <div>404 not found</div>; 
    }
}

export default ROUTES;