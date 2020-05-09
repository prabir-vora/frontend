import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';

import { MainNavBar, MainFooter, LoadingScreen } from 'components';

import qs from 'query-string';
import { ShowConfirmNotif } from 'functions';

import { withRouter } from 'react-router-dom';

class StripeRedirectPage extends Component {
  state = { savingConnectAccount: true };
  constructor(props) {
    super(props);
    const { code } = qs.parse(props.location.search);

    this.state = {
      code,
    };
  }

  async componentDidMount() {
    console.log(this.state);
    console.log(this.props);

    const { saveStripeConnectAuthCode } = UserDuck.actionCreators;

    if (this.state.code) {
      const { success, message } = await this.props.dispatch(
        saveStripeConnectAuthCode(this.state.code),
      );

      if (success) {
        this.confirmNotif = ShowConfirmNotif({
          message: 'Stripe Account setup successful',
          type: 'success',
        });

        this.props.history.push('/user/settings/sellerSettings');
      } else {
        this.confirmNotif = ShowConfirmNotif({
          message: `Error: ${message}`,
          type: 'error',
        });
        this.props.history.push('/user/settings/sellerSettings');
      }
    } else {
      window.location.href = `https://localhost:3000/user/settings/sellerSettings`;
    }
  }

  render() {
    if (this.state.savingConnectAccount) {
      return <LoadingScreen />;
    }
    return null;
  }
}

const x = withRouter(StripeRedirectPage);

export default connect()(x);
