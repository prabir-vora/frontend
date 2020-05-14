import React, { Component } from 'react';

import Style from '../style.module.scss';

import qs from 'query-string';

const stripeConnectButton = require('assets/Images/blue-on-dark.png');

export default class SellerSettings extends Component {
  state = {
    isStripeConnectSetup: false,
    stripeClientID: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
    stripeConnectOnboardingUrl: '',
  };

  componentDidMount() {
    const { user } = this.props;

    const { email, username } = user;

    const queryParameters = {
      client_id: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
      scope: 'read_write',
      redirect_uri: 'https://localhost:3000/stripeRedirect',
      response_type: 'code',
      'stripe_user[email]': email,
      'stripe_user[url]': `https://localhost:3000/${username}`,
      'stripe_user[country]': 'US',
      'stripe_user[business_type]': 'sole_prop',
      'stripe_user[currency]': 'usd',
    };
    const queryString = qs.stringify(queryParameters);
    console.log(queryString);

    this.setState({
      stripeConnectOnboardingUrl: `https://connect.stripe.com/oauth/authorize?${queryString}`,
    });
  }

  renderStripeConnectButton = () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <a href={this.state.stripeConnectOnboardingUrl}>
        <img
          alt="Connect with Stripe"
          style={{ height: '45px' }}
          src={stripeConnectButton}
        />
      </a>
    </div>
  );

  renderSuccessMessage = () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          marginBottom: '20px',
          fontSize: '20px',
          color: 'black',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        Your seller payment account is all setup and ready for payouts.
      </div>
      <a
        style={{
          color: 'black',
          textAlign: 'center',
          marginTop: '20px',
          textDecoration: 'underline',
          width: '100%',
        }}
        href="https://dashboard.stripe.com/dashboard"
        target="_blank"
        rel="noopener noreferrer"
      >
        Go to Stripe Dashboard
      </a>
    </div>
  );

  renderSellerAddressComponent = () => {
    return null;
  };

  render() {
    const {
      stripe_connect_user_id,
      stripe_connect_access_token,
      stripe_connect_account_status,
    } = this.props.user;
    const isStripeConnectComplete =
      stripe_connect_user_id &&
      stripe_connect_access_token &&
      stripe_connect_account_status === 'active';

    return (
      <div className={Style.container}>
        <div className={Style.title}>Seller Settings</div>

        <div className={Style.form}>
          <p className={Style.formInputLabel}>Merchant Account</p>
          {isStripeConnectComplete
            ? this.renderSuccessMessage()
            : this.renderStripeConnectButton()}
          <br />
          <br />
          <p className={Style.formInputLabel}>Seller Address</p>
          {this.renderSellerAddressComponent()}
        </div>
      </div>
    );
  }
}
