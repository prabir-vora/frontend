import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history'
import { composeWithDevTools } from 'redux-devtools-extension';

// Import all the Ducks
// import UserDuck from './ducks/User.duck';
// import ResellerDuck from './ducks/Reseller.duck';
// import HomepageDuck from './ducks/Homepage.duck';
// import ApparelDuck from './ducks/Apparel.duck';
// import SneakersDuck from './ducks/Sneakers.duck';
// import ProductTemplateDuck from './ducks/ProductTemplate.duck';
// import ResellerTemplateDuck from './ducks/ResellerTemplate.duck';
// import SearchFilterDuck from './ducks/SearchFilter.duck';
// import SearchMenuDuck from './ducks/SearchMenu.duck';
// import NotificationDuck from './ducks/Notification.duck';
import AdminUIDuck from './ducks/Admin/UI.duck';
import AdminDuck from './ducks/Admin/Admin.duck';
import TestObjectsDuck from "./ducks/Admin/TestObjects.duck";

const initialState = {};
const middleware = [thunk];

export const history = createBrowserHistory();

// Method to combine all the Ducks
const combineDucks = (...ducks) => {
    const reducers = ducks.reduce((root, duck) => {
        const { duckName, reducer} = duck;
        return { ...root, [duckName]: reducer };
    }, {});
    console.log(reducers);
    const reducersWithRouter = Object.assign(reducers, { router: connectRouter(history)})
	return combineReducers(reducersWithRouter);
}
    

// Register Ducks
const rootReducer = combineDucks(
    // ResellerDuck,
    // HomepageDuck,
    // ApparelDuck,
    // SneakersDuck,
    // ProductTemplateDuck,
    // ResellerTemplateDuck,
    // SearchFilterDuck,
    // SearchMenuDuck,
    // NotificationDuck
    AdminUIDuck,
    AdminDuck,
    TestObjectsDuck
);

const store = createStore(
    rootReducer, 
    initialState,
    composeWithDevTools(applyMiddleware(
        routerMiddleware(history),
        ...middleware
    ))
);

export default store;