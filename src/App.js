import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import ROUTES from './constants/routes';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, Flip } from 'react-toastify';
import AppAuthContainer from 'AppAuthContainer';
import ClientModals from 'ClientModals';

import { withCookies } from 'react-cookie';

import store, { history } from './stores/store';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div style={{ height: 'auto' }}>
            <AppAuthContainer />
            <ClientModals />
            <Switch>
              <Route exact path="/" component={ROUTES('homePage')} />
              <Route exact path="/about" component={ROUTES('aboutPage')} />
              <Route exact path="/brands" component={ROUTES('brandsPage')} />
              <Route path="/resellers" component={ROUTES('resellerListPage')} />
              <Route
                path="/resellers/:resellerID"
                component={ROUTES('resellerTemplatePage')}
              />
              <Route path="/search/" component={ROUTES('searchPage')} />
              <Route exact path="/shop" component={ROUTES('shopPage')} />
              <Route
                exact
                path="/shop/:productListingID"
                component={ROUTES('productListingPage')}
              />
              <Route
                exact
                path="/shop/listing/:listingID"
                component={ROUTES('shopListingPage')}
              />
              <Route exact path="/sell" component={ROUTES('sellPage')} />
              <Route
                exact
                path="/sell/createListing"
                component={ROUTES('createListing')}
              />
              <Route
                exact
                path="/resellerSetup"
                component={ROUTES('resellerSetupPage')}
              />
              <Route
                exact
                path="/localMarketplace"
                component={ROUTES('localMarketplacePage')}
              />
              <Route exact path="/myList" component={ROUTES('myListPage')} />
              <Route
                exact
                path="/localMarketplace/:listingID"
                component={ROUTES('localListingPage')}
              />
              <Route exact path="/user" component={ROUTES('profilePage')} />
              <Route
                exact
                path="/user/:username"
                component={ROUTES('userPage')}
              />
              <Route path="/auth" component={ROUTES('authenticationPage')} />'
              <Route path="/admin" component={ROUTES('adminPage')} />
            </Switch>
            <ToastContainer transition={Flip} />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default withCookies(App);
