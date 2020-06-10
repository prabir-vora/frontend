import React, { Component } from 'react';

import Style from '../style.module.scss';

import * as immutable from 'object-path-immutable';

import cx from 'classnames';

import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { Button } from 'fields';

import countryRegionData from 'country-region-data';

import { ClipLoader } from 'react-spinners';

export default class NewAddressInput extends Component {
  state = {
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
    creatingNewAdress: false,
  };

  // componentDidMount() {
  //   if (this.props.user) {
  //     this.setState({
  //       country_code: this.props.user.country,
  //     });
  //   }
  // }

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

  onGetButtonStatus = () => {
    console.log(this.state.address);
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

  onSubmitShippingForm = async e => {
    e.preventDefault();
    console.log(this.state);

    this.setState({
      creatingNewAdress: true,
    });

    const { updated, message } = await this.props.createNewAddress(
      this.state.address,
    );

    console.log(message);

    if (!updated && message) {
      this.setState({
        errorMessage: message,
        creatingNewAdress: false,
      });
    } else {
      this.setState({
        creatingNewAdress: false,
      });
    }
  };

  render() {
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
        <h1 className={Style.title}> SHIPPING ADDRESS</h1>
        <form
          className={Style.form}
          onSubmit={e => this.onSubmitShippingForm(e)}
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
          <div className={Style.errorMessage}>{this.state.errorMessage}</div>
          <br />
          {!this.state.creatingNewAdress ? (
            <div className={Style.buttonsContainer}>
              {this.props.addNewAddress && (
                <Button
                  className={Style.submitButton}
                  onClick={() => this.props.goBack()}
                >
                  Back
                </Button>
              )}
              <Button
                className={Style.submitButton}
                name="submit"
                status={this.onGetButtonStatus()}
              >
                Continue
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
  }
}
