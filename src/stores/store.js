import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';

// Import all the Ducks

import AppAuthDuck from './ducks/AppAuth.duck';
import UserDuck from './ducks/User.duck';
import ProductListingDuck from './ducks/ProductListing.duck';
import AdminUIDuck from './ducks/Admin/UI.duck';
import AdminDuck from './ducks/Admin/Admin.duck';
import TestObjectsDuck from './ducks/Admin/TestObjects.duck';
import SellDuck from './ducks/Sell.duck';
import ResellListingDuck from './ducks/ResellListing.duck';
import ConversationDuck from './ducks/Conversation.duck';
import LocalListingDuck from './ducks/LocalListing.duck';
import BrowseUserDuck from './ducks/BrowseUser.duck';

const initialState = {};
const middleware = [thunk];

export const history = createBrowserHistory();

// Method to combine all the Ducks
const combineDucks = (...ducks) => {
  const reducers = ducks.reduce((root, duck) => {
    const { duckName, reducer } = duck;
    return { ...root, [duckName]: reducer };
  }, {});
  console.log(reducers);
  const reducersWithRouter = Object.assign(reducers, {
    router: connectRouter(history),
  });
  return combineReducers(reducersWithRouter);
};

// Register Ducks
const rootReducer = combineDucks(
  AppAuthDuck,
  ConversationDuck,
  ProductListingDuck,
  AdminUIDuck,
  AdminDuck,
  SellDuck,
  TestObjectsDuck,
  UserDuck,
  ResellListingDuck,
  LocalListingDuck,
  BrowseUserDuck,
);

const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
    applyMiddleware(routerMiddleware(history), ...middleware),
  ),
);

export default store;
