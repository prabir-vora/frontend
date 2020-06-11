import React, { Component } from 'react';

import UserDuck from 'stores/ducks/User.duck';

import { connect } from 'react-redux';

import Style from '../style.module.scss';

import qs from 'query-string';

import { RadioButton, Button } from 'fields';

import { RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from 'assets/Icons';

const stripeConnectButton = require('assets/Images/blue-on-dark.png');

class SellerSettings extends Component {
  state = {
    isStripeConnectSetup: false,
    stripeClientID: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
    stripeConnectOnboardingUrl: '',
    activeShippingID: '',
  };

  componentDidMount() {
    const { user } = this.props;

    const { email, username, activeSellerAddressID } = user;

    const queryParameters = {
      client_id: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
      scope: 'read_write',
      redirect_uri: 'https://localhost:3000/stripeRedirect',
      response_type: 'code',
      'stripe_user[country]': 'US',
      'stripe_user[business_type]': 'sole_prop',
      'stripe_user[currency]': 'usd',
    };
    const queryString = qs.stringify(queryParameters);
    console.log(queryString);

    this.setState({
      stripeConnectOnboardingUrl: `https://connect.stripe.com/oauth/authorize?${queryString}`,
      activeShippingID: activeSellerAddressID,
    });
  }

  onCancel = () => {
    this.setState({
      activeShippingID: this.props.user.activeSellerAddressID,
    });
  };

  onGetSubmitBtnStatus = () => {
    if (this.state.activeShippingID !== this.props.user.activeSellerAddressID) {
      return 'active';
    } else {
      return 'inactive';
    }
  };

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
      <div className={Style.stripeMessage}>
        Your seller payment account is all setup and ready for payouts.
      </div>
      <a
        style={{
          color: 'white',
          textAlign: 'center',
          marginTop: '20px',
          width: '200px',
          fontSize: '14px',
          background: '#919496',
          textTransform: 'uppercase',
          borderRadius: '10px',
          padding: '10px',
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
    const { user } = this.props;
    const { addresses } = user;

    return (
      <div className={Style.ShippingListContainer}>
        {addresses.map(address => {
          const {
            address1,
            address2,
            city_locality,
            country_code,
            phone,
            postal_code,
            state_province,
          } = address;
          const addressLabel = `${address1} ${address2}, ${city_locality}, ${state_province}, ${country_code}, ${postal_code}`;

          return (
            <div className={Style.shippingListItem} key={address.id}>
              <button
                onClick={() =>
                  this.setState({
                    activeShippingID: address.id,
                  })
                }
                className={Style.ListItemButton}
              >
                {address.id === this.state.activeShippingID ? (
                  <RadioButtonCheckedIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
                {addressLabel}
              </button>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              const { showNewAddressModalCreator } = UserDuck.actionCreators;
              this.props.dispatch(showNewAddressModalCreator());
            }}
            className={Style.addNewButton}
          >
            ADD ADDRESS +
          </Button>
        </div>
      </div>
    );
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
        <div className={Style.buttonsRow}>
          <Button
            className={Style.saveButton}
            onClick={() => this.onSaveProfile()}
            status={this.onGetSubmitBtnStatus()}
          >
            SAVE ADDRESS
          </Button>
          <button
            className={Style.cancelButton}
            onClick={() => this.onCancel()}
          >
            CANCEL
          </button>
        </div>
      </div>
    );
  }
}

export default connect()(SellerSettings);
