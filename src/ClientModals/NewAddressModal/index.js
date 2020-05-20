import React, { Component } from 'react';

import Style from './style.module.scss';

import ReactModal from 'react-modal';

import { CloseIcon } from 'assets/Icons';

import * as immutable from 'object-path-immutable';

import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

import { Button } from 'fields';

import countryRegionData from 'country-region-data';

import cx from 'classnames';

export default class NewAddressModal extends Component {
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

  selectRegion(val) {
    this.setState({
      address: immutable.set(this.state.address, 'state_province', val),
    });
  }

  onSubmitShippingForm = async e => {
    e.preventDefault();
    console.log(this.state);

    const { success, message } = await this.props.onCreateNewSellerAddress(
      this.state.address,
    );

    if (!success && message) {
      this.setState({
        errorMessage: message,
      });
    }
  };

  renderAddressContainer() {
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
          <p className={Style.formInputLabel}>Country</p>
          <CountryDropdown
            value={country}
            onChange={val => this.selectCountry(val)}
            classes={cx(Style.inputSelector, Style.countrySelect)}
          />
          <br />
          <p className={Style.formInputLabel}>Full Legal Name</p>
          <input
            className={Style.formInput}
            type="text"
            name="name"
            value={name}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <p className={Style.formInputLabel}>Street Address 1</p>
          <input
            className={Style.formInput}
            type="address"
            name="address1"
            value={address1}
            onChange={e =>
              this.onChangeFieldValue(e.target.name, e.target.value)
            }
          />
          <br />
          <p className={Style.formInputLabel}>Street Address 2</p>
          <input
            className={Style.formInput}
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
              <p className={Style.formInputLabel}>City</p>
              <input
                className={Style.formInput}
                type="city"
                name="city_locality"
                value={city_locality}
                onChange={e =>
                  this.onChangeFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
            <div className={Style.halfWidthInput}>
              <p className={Style.formInputLabel}>State/Province</p>
              <RegionDropdown
                blankOptionLabel="No country selected"
                defaultOptionLabel="Select a region"
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
              <p className={Style.formInputLabel}>Postal/Zip Code</p>
              <input
                className={Style.formInput}
                type="postal"
                name="postal_code"
                value={postal_code}
                onChange={e =>
                  this.onChangeFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
            <div className={Style.halfWidthInput}>
              <p className={Style.formInputLabel}>Phone Number</p>
              <input
                className={Style.formInput}
                type="phone"
                name="phone"
                value={phone}
                onChange={e =>
                  this.onChangeFieldValue(e.target.name, e.target.value)
                }
              />
            </div>
          </div>
          <br />
          <div className={Style.errorMessage}>{this.state.errorMessage}</div>
          <br />
          <Button
            className={Style.submitButton}
            name="submit"
            status={this.onGetButtonStatus()}
          >
            Continue
          </Button>
        </form>
      </div>
    );
  }

  render() {
    return (
      <ReactModal
        isOpen={true}
        className={Style.Modal}
        overlayClassName={Style.Overlay}
        contentLabel="Example Modal"
      >
        <button className={Style.close} onClick={() => this.props.onClose()}>
          <CloseIcon />
        </button>
        <div className={Style.body}>
          <div className={Style.authContainer}>
            {this.renderAddressContainer()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
