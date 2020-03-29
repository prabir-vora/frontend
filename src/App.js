import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import ROUTES from './constants/routes';
import 'react-toastify/dist/ReactToastify.min.css';
import { ToastContainer, Flip } from 'react-toastify';

import store, { history } from './stores/store';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div style={{ height: 'auto' }}>
            <Switch>
              <Route exact path="/" component={ROUTES('homePage')} />
              <Route path="/resellers" component={ROUTES('resellerListPage')} />
              <Route
                path="/resellers/:resellerID"
                component={ROUTES('resellerTemplatePage')}
              />
              <Route exact path="/shop" component={ROUTES('shopPage')} />
              <Route
                exact
                path="/shop/:productListingID"
                component={ROUTES('productListingPage')}
              />
              <Route path="/user" component={ROUTES('profilePage')} />
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
