import React, { Component } from 'react';

import UserDuck from 'stores/ducks/User.duck';

import { connect } from 'react-redux';

import Style from '../style.module.scss';

import qs from 'query-string';

import { RadioButton, Button } from 'fields';

import { RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from 'assets/Icons';

import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import countryRegionData from 'country-region-data';

import { ClipLoader } from 'react-spinners';

import * as immutable from 'object-path-immutable';

import cx from 'classnames';

const stripeConnectButton = require('assets/Images/blue-on-dark.png');

class SellerSettings extends Component {
  state = {
    isStripeConnectSetup: false,
    stripeClientID: 'ca_HEFQOOaKgt2E08XtNo3uTO5Nu9WI0dMJ',
    stripeConnectOnboardingUrl: '',
    activeShippingID: '',
    addNewAddress: false,
    address: {
      postal_code: '',
      city_locality: '',
      state_province: '',
      country_code: '',
      country: '',
      address1: '',
      address2: '',
      name: '',
      phone: '',
    },
    errorMessage: '',
    updatingAddress: '',
    createNewErrorMessage: '',
    creatingNewAdress: false,
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

  componentDidUpdate(prevProps, prevState) {
    if (this.props.user !== prevProps.user) {
      const { activeSellerAddressID } = this.props.user;

      this.setState({
        activeShippingID: activeSellerAddressID,
      });
    }
  }

  onCancel = () => {
    this.setState({
      activeShippingID: this.props.user.activeSellerAddressID,
    });
  };

  onSubmitNewSellerAddress = async e => {
    e.preventDefault();
    console.log(this.state);

    const { address } = this.state;

    this.setState({
      creatingNewAdress: true,
    });

    const {
      createNewSellerAddress,
      fetchUpdatedUser,
    } = UserDuck.actionCreators;

    const { success, message } = await this.props.dispatch(
      createNewSellerAddress(address),
    );

    if (!success && message) {
      this.setState({
        createNewErrorMessage: message,
        creatingNewAdress: false,
      });
    } else {
      await this.props.dispatch(fetchUpdatedUser());
      this.setState({
        creatingNewAdress: false,
        addNewAddress: false,
      });
    }
  };

  onUpdateSellerAddress = async () => {
    const { activeShippingID } = this.state;

    this.setState({
      updatingAddress: true,
    });

    const { updateSellerAddress, fetchUpdatedUser } = UserDuck.actionCreators;

    const { success } = await this.props.dispatch(
      updateSellerAddress(activeShippingID),
    );

    if (success) {
      await this.props.dispatch(fetchUpdatedUser());
      this.setState({
        updatingAddress: false,
      });
    } else {
      this.setState({
        updatingAddress: false,
        errorMessage: 'Something went wrong',
      });
    }
  };

  onGetSubmitBtnStatus = () => {
    const {
      country,
      name,
      address1,
      city_locality,
      state_province,
      postal_code,
      phone,
    } = this.state.address;

    if (
      !this.state.addNewAddress &&
      this.state.activeShippingID !== this.props.user.activeSellerAddressID
    ) {
      return 'active';
    } else if (
      this.state.addNewAddress &&
      country !== '' &&
      name !== '' &&
      address1 !== '' &&
      city_locality !== '' &&
      state_province !== '' &&
      postal_code !== '' &&
      phone !== ''
    ) {
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

  renderNewSellerAddress = () => {
    const {
      country,
      name,
      address1,
      address2,
      city_locality,
      state_province,
      postal_code,
      phone,
    } = this.state.address;

    return (
      <div className={Style.formContainer}>
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Button
            onClick={() => {
              // const { showNewAddressModalCreator } = UserDuck.actionCreators;
              // this.props.dispatch(showNewAddressModalCreator());
              this.setState({
                addNewAddress: false,
              });
            }}
            className={Style.addNewButton}
          >
            BACK
          </Button>
        </div>

        <form
          className={Style.form}
          onSubmit={e => this.onSubmitNewSellerAddress(e)}
        >
          <br />
          <input
            className={Style.formInput}
            placeholder={'Full Legal Name'}
            type="text"
            name="name"
            value={name}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <input
            className={Style.formInput}
            placeholder={'Street Address 1'}
            type="address"
            name="address1"
            value={address1}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <input
            className={Style.formInput}
            placeholder={'Street Address 2'}
            type="address"
            name="address2"
            value={address2}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <div className={Style.twoInputsContainer}>
            <div className={Style.halfWidthInput}>
              <input
                className={Style.formInput}
                placeholder={'City'}
                type="city"
                name="city_locality"
                value={city_locality}
                onChange={e =>
                  this.onChangeFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
            <div className={Style.halfWidthInput}>
              <RegionDropdown
                placeeholder={'State/Province'}
                blankOptionLabel="State"
                defaultOptionLabel="State"
                value={state_province}
                country={country}
                onChange={val => this.selectRegion(val)}
                classes={cx(Style.inputSelector, Style.regionSelect)}
              />
            </div>
          </div>
          <br />
          <div className={Style.twoInputsContainer}>
            <div className={Style.halfWidthInput}>
              <input
                className={Style.formInput}
                placeholder={'Zip Code'}
                type="postal"
                name="postal_code"
                value={postal_code}
                onChange={e =>
                  this.onChangeFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
            <div className={Style.halfWidthInput}>
              <CountryDropdown
                placeeholder={'Country'}
                value={country}
                onChange={val => this.selectCountry(val)}
                classes={cx(Style.inputSelector, Style.countrySelect)}
              />
            </div>
          </div>
          <br />
          <input
            className={Style.formInput}
            placeholder={'Phone Number'}
            type="phone"
            name="phone"
            value={phone}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <div className={Style.errorMessage}>
            {this.state.createNewErrorMessage}
          </div>
          <br />
          {!this.state.creatingNewAdress ? (
            <div className={Style.buttonsContainer}>
              <Button
                className={Style.submitButton}
                name="submit"
                status={this.onGetSubmitBtnStatus()}
              >
                ADD ADDRESS
              </Button>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',

                alignItems: 'center',
              }}
            >
              <ClipLoader width={'30px'} color={'#fff'} />
              <div>Adding address...</div>
            </div>
          )}
        </form>
      </div>
    );
  };

  onChangeFieldValue = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    this.setState({
      address: immutable.set(this.state.address, fieldName, fieldValue),
    });
  };

  selectCountry(val) {
    console.log(countryRegionData);

    const selectedCountry = countryRegionData.filter(data => {
      return data.countryName === val;
    });

    const { countryShortCode } = selectedCountry[0];

    this.setState({
      address: immutable
        .wrap(this.state.address)
        .set('country', val)
        .set('country_code', countryShortCode)
        .value(),
    });
  }

  selectRegion(val) {
    this.setState({
      address: immutable.set(this.state.address, 'state_province', val),
    });
  }

  renderSellerAddressComponent = () => {
    const { user } = this.props;
    const { addresses } = user;

    if (this.state.addNewAddress) {
      return this.renderNewSellerAddress();
    }

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
              this.setState({
                addNewAddress: true,
              });
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
        {!this.state.addNewAddress && (
          <React.Fragment>
            {!this.state.updatingAddress ? (
              <div className={Style.buttonsRow}>
                <Button
                  className={Style.saveButton}
                  onClick={() => this.onUpdateSellerAddress()}
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
            ) : (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',

                  alignItems: 'center',
                }}
              >
                <ClipLoader width={'30px'} color={'#fff'} />
                <div>Updating Address...</div>
              </div>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default connect()(SellerSettings);
