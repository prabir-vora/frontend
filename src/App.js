import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import ScrollToTop from './ScrollToTop';
import ROUTES from './constants/routes';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, Flip } from 'react-toastify';
import AppAuthContainer from 'AppAuthContainer';
import ClientModals from 'ClientModals';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import MusicPlayer from 'components/MusicPlayer';

import { withCookies } from 'react-cookie';

import store, { history } from './stores/store';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// loadStripe is initialized with your real test publishable API key.
const promise = loadStripe('pk_test_qJ4ZjkxQSh3ANlUkoPLkb9kc00BUnqG3b0', {
  stripeAccount: 'acct_1Ge4mVBFauUskiNa',
});

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Elements stripe={promise}>
          <ConnectedRouter history={history}>
            <ScrollToTop>
              <div style={{ height: 'auto' }}>
                <AppAuthContainer />
                <ClientModals />
                {/* <MusicPlayer /> */}
                <Switch>
                  <Route exact path="/" component={ROUTES('homePage')} />
                  <Route exact path="/about" component={ROUTES('aboutPage')} />
                  <Route
                    exact
                    path="/brands"
                    component={ROUTES('brandsPage')}
                  />
                  {/* <Route
                  path="/resellers"
                  component={ROUTES('resellerListPage')}
                /> */}
                  {/* <Route
                  path="/resellers/:resellerID"
                  component={ROUTES('resellerTemplatePage')}
                /> */}
                  <Route path="/search/" component={ROUTES('searchPage')} />
                  <Route exact path="/shop" component={ROUTES('shopPage')} />
                  <Route
                    exact
                    path="/shop/:productListingID"
                    component={ROUTES('productListingPage')}
                  />
                  <Route
                    exact
                    path="/listing/:listingID"
                    component={ROUTES('listingPage')}
                  />
                  <Route exact path="/sell" component={ROUTES('sellPage')} />
                  <Route
                    exact
                    path="/sell/createListing"
                    component={ROUTES('createListing')}
                  />
                  {/* <Route
                  exact
                  path="/resellerSetup"
                  component={ROUTES('resellerSetupPage')}
                /> */}
                  <Route
                    exact
                    path="/localMarketplace"
                    component={ROUTES('localMarketplacePage')}
                  />
                  {/* <Route exact path="/myList" component={ROUTES('myListPage')} /> */}
                  <Route
                    exact
                    path="/localMarketplace/:listingID"
                    component={ROUTES('localListingPage')}
                  />
                  <Route
                    exact
                    path="/photoGuidelines"
                    component={ROUTES('photoGuidelinesPage')}
                  />
                  <Route
                    exact
                    path="/orders/:orderNumber/:formID?"
                    component={ROUTES('orderPage')}
                  />
                  <Route
                    exact
                    path="/sellOrders/:orderNumber"
                    component={ROUTES('sellOrderPage')}
                  />
                  <Route
                    path="/user/:activeNavBarID?/:settingsNavID?"
                    component={ROUTES('profilePage')}
                  />
                  <Route
                    path="/auth"
                    component={ROUTES('authenticationPage')}
                  />
                  '
                  <Route path="/admin" component={ROUTES('adminPage')} />
                  <Route
                    path="/stripeRedirect"
                    component={ROUTES('stripeRedirectPage')}
                  />
                  <Route
                    path="/contactUs"
                    component={ROUTES('contactUsPage')}
                  />
                  {/* <Route exact path="/:username" component={ROUTES('userPage')} /> */}
                  <Route exact path="/" component={ROUTES('notFound')} />
                </Switch>
                <ToastContainer transition={Flip} />
              </div>
            </ScrollToTop>
          </ConnectedRouter>
        </Elements>
      </Provider>
    );
  }
}

export default withCookies(App);
