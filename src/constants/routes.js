//  Import all the pages
import React from 'react';
import {
  AdminPage,
  AuthenticationPage,
  HomePage,
  ProductListingPage,
  ProfilePage,
  ResellerListPage,
  ResellerTemplatePage,
  LocalMarketplacePage,
  ShopPage,
} from '../pages';

const ROUTES = (routeName = '', props = {}) => {
  switch (routeName) {
    case 'homePage':
      return HomePage;
    case 'resellerListPage':
      return ResellerListPage;
    case 'resellerTemplatePage':
      return ResellerTemplatePage;
    case 'shopPage':
      return ShopPage;
    case 'productListingPage':
      return ProductListingPage;
    case 'localMarketplacePage':
      return LocalMarketplacePage;
    case 'profilePage':
      return ProfilePage;
    case 'authenticationPage':
      return AuthenticationPage;
    case 'adminPage':
      return AdminPage;
    default:
      return () => <div>404 not found</div>;
  }
};

export default ROUTES;
