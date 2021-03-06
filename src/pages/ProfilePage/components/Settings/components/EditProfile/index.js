import React, { Component } from 'react';
import Style from '../style.module.scss';

import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';

import { LocationSearchInput, Button } from 'fields';

import SetupMapContainer from 'components/SetupMapContainer';

import * as immutable from 'object-path-immutable';
import { ShowConfirmNotif } from 'functions';

import { ClipLoader } from 'react-spinners';

class EditProfile extends Component {
  confirmNotif = null;

  state = {
    profile: {
      name: '',
      username: '',
      password: '',
      address: '',
      _geoloc: '',
    },
    isUsernameValid: true,
    savingProfile: false,
  };

  componentDidMount() {
    const {
      name,
      username,
      address,
      _geoloc,
      // country = 'US',
    } = this.props.user;
    this.setState(
      {
        profile: {
          name,
          username,
          address,
          _geoloc,
          password: '',
          // country,
        },
      },
      () => console.log(this.state),
    );
  }

  onGetSubmitBtnStatus = () => {
    const {
      name,
      username,
      address,
      _geoloc,
      country = 'US',
    } = this.props.user;

    if (
      (this.state.profile.name === name &&
        this.state.profile.username === username &&
        this.state.profile.address === address &&
        this.state.profile._geoloc.lat === _geoloc.lat &&
        this.state.profile._geoloc.lng === _geoloc.lng) ||
      this.state.profile.name === '' ||
      this.state.profile.username === '' ||
      this.state.profile.address === '' ||
      this.state.profile._geoloc.lat === '' ||
      this.state.lng === '' ||
      (this.props.user.serviceName === 'password' &&
        this.state.profile.password === '')
    ) {
      console.log('inactive');
      return 'inactive';
    } else {
      return 'active';
    }
  };

  onChangeFieldValue = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue);
    this.setState({
      profile: immutable.set(this.state.profile, fieldName, fieldValue),
    });
  };

  onSelectLocation = (address, lat, lng) => {
    this.setState(
      {
        profile: immutable
          .wrap(this.state.profile)
          .set('address', address)
          .set('_geoloc', { lat, lng })
          .value(),
      },
      () => console.log(this.state),
    );
  };

  onChangeUsernameValue = async username => {
    this.setState({
      profile: immutable.set(this.state.profile, 'username', username.trim()),
    });
    const { fetchIsUsernameValid } = UserDuck.actionCreators;
    const { success, isUsernameValid } = await this.props.dispatch(
      fetchIsUsernameValid(username),
    );

    success &&
      this.setState({
        isUsernameValid,
      });
  };

  // onCountryChange = e => {
  //   this.setState({
  //     profile: immutable.set(this.state.profile, 'country', e.target.value),
  //   });
  // };

  onCancel = () => {
    const {
      name,
      username,
      address,
      _geoloc,
      // country = 'US',
    } = this.props.user;
    this.setState(
      {
        profile: {
          name,
          username,
          address,
          _geoloc,
          // country,
        },
      },
      () => console.log(this.state),
    );
  };

  onSaveProfile = async () => {
    this.setState({
      savingProfile: true,
    });
    const { editProfile, fetchUpdatedUser } = UserDuck.actionCreators;
    const { success } = await this.props.dispatch(
      editProfile(this.state.profile),
    );

    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Profile updated successfully',
        type: 'success',
      });

      await this.props.dispatch(fetchUpdatedUser());

      this.setState({
        savingProfile: false,
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Profile update failed. Ensure correct password.',
        type: 'error',
      });

      this.setState({
        savingProfile: false,
      });
    }
  };

  render() {
    const {
      name,
      password,
      username,
      address,
      _geoloc,
      // country,
    } = this.state.profile;

    const { lat, lng } = _geoloc;

    console.log(lat);
    console.log(lng);
    return (
      <div className={Style.container}>
        <div className={Style.title}>Edit Profile</div>
        <div className={Style.form}>
          <p className={Style.formInputLabel}>
            Approx. Local Marketplace Location
          </p>
          <div style={{ display: 'flex' }}>
            <LocationSearchInput
              address={address}
              latitude={lat}
              longitude={lng}
              onSelectLocation={this.onSelectLocation}
            />
          </div>
          <div>
            {address && (
              <SetupMapContainer
                _geoloc={{
                  lat: lat,
                  lng: lng,
                }}
                containerElement={
                  <div
                    style={{
                      height: `150px`,
                      width: '100%',
                      maxWidth: '400px',
                      margin: '20px 0px',
                    }}
                  />
                }
                mapElement={<div style={{ height: `100%` }} />}
              />
            )}
          </div>

          <br />
          <p className={Style.formInputLabel}>Name</p>
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
          <p className={Style.formInputLabel}>Username</p>
          <input
            className={Style.formInput}
            type="text"
            name="username"
            value={username}
            autoComplete="off"
            onChange={e => this.onChangeUsernameValue(e.target.value)}
          />
          {this.state.profile.username === this.props.user.username ? null : (
            <p
              className={
                this.state.isUsernameValid
                  ? Style.validUsername
                  : Style.invalidUsername
              }
            >
              {this.state.isUsernameValid
                ? 'Username is Valid'
                : 'Username is Invalid/Taken'}
            </p>
          )}

          {/* <br />

          <p className={Style.formInputLabel}>Buying/Selling Country</p>
          <div className={Style.countrySelector}>
            <select
              class={Style.countrySelect}
              aria-label="country"
              value={country}
              onChange={value => this.onCountryChange(value)}
            >
              <option value="AU">Australia</option>
              <option value="AT">Austria</option>
              <option value="BE">Belgium</option>
              <option value="BR">Brazil</option>
              <option value="CA">Canada</option>
              <option value="CN">China</option>
              <option value="CZ">Czech Republic</option>
              <option value="DK">Denmark</option>
              <option value="FI">Finland</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="HK">Hong Kong</option>
              <option value="IN">India</option>
              <option value="ID">Indonesia</option>
              <option value="IT">Italy</option>
              <option value="JP">Japan</option>
              <option value="MY">Malaysia</option>
              <option value="MX">Mexico</option>
              <option value="NL">Netherlands</option>
              <option value="NO">Norway</option>
              <option value="NZ">New Zealand</option>
              <option value="PH">Philippines</option>
              <option value="PL">Poland</option>
              <option value="PT">Portugal</option>
              <option value="RU">Russia</option>
              <option value="SG">Singapore</option>
              <option value="ES">Spain</option>
              <option value="SE">Sweden</option>
              <option value="CH">Switzerland</option>
              <option value="TH">Thailand</option>
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="VN">Vietnam</option>
            </select>
          </div> */}
          <br />
          {this.props.user.serviceName === 'password' && (
            <React.Fragment>
              <p className={Style.formInputLabel}>Confirm Password</p>
              <input
                className={Style.formInput}
                type="password"
                name="password"
                value={password || ''}
                onChange={e =>
                  this.onChangeFieldValue(e.target.name, e.target.value)
                }
              />
            </React.Fragment>
          )}
          <br />
          <br />
          {!this.state.savingProfile ? (
            <div className={Style.buttonsRow}>
              <Button
                className={Style.saveButton}
                onClick={() => this.onSaveProfile()}
                status={this.onGetSubmitBtnStatus()}
              >
                SAVE PROFILE
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
              <div>Saving Profile...</div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default connect()(EditProfile);
