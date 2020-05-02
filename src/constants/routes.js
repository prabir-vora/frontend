//  Import all the pages
import React from 'react';
import {
  AboutPage,
  AdminPage,
  AuthenticationPage,
  BrandsPage,
  HomePage,
  PhotoGuidelinesPage,
  ProductListingPage,
  ProfilePage,
  ResellerListPage,
  ResellerSetupPage,
  ResellerTemplatePage,
  LocalListingPage,
  LocalMarketplacePage,
  SearchPage,
  ShopPage,
  ShopListingPage,
  SellPage,
  CreateListingPage,
  UserPage,
  MyListPage,
} from '../pages';

const ROUTES = (routeName = '', props = {}) => {
  switch (routeName) {
    case 'homePage':
      return HomePage;
    case 'aboutPage':
      return AboutPage;
    case 'brandsPage':
      return BrandsPage;
    case 'myListPage':
      return MyListPage;
    case 'resellerListPage':
      return ResellerListPage;
    case 'resellerSetupPage':
      return ResellerSetupPage;
    case 'resellerTemplatePage':
      return ResellerTemplatePage;
    case 'photoGuidelinesPage':
      return PhotoGuidelinesPage;
    case 'productListingPage':
      return ProductListingPage;
    case 'localListingPage':
      return LocalListingPage;
    case 'localMarketplacePage':
      return LocalMarketplacePage;
    case 'profilePage':
      return ProfilePage;
    case 'authenticationPage':
      return AuthenticationPage;
    case 'adminPage':
      return AdminPage;
    case 'sellPage':
      return SellPage;
    case 'searchPage':
      return SearchPage;
    case 'shopPage':
      return ShopPage;
    case 'shopListingPage':
      return ShopListingPage;
    case 'createListing':
      return CreateListingPage;
    case 'userPage':
      return UserPage;
    default:
      return () => <div>404 not found</div>;
  }
};

export default ROUTES;
