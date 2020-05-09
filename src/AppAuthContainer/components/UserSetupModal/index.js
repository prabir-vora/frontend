import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { Button, TextInput, LocationSearchInput } from 'fields';

import * as immutable from 'object-path-immutable';

export default class UserSetupModal extends Component {
  state = {
    setupInfo: {
      address: '',
      lat: '',
      lng: '',
      username: '',
      country: 'US',
    },
    isUsernameValid: false,
  };

  async componentDidMount() {
    const { user } = this.props;
    const { email } = user;
    const splitEmail = email.split('@');
    const usernameFromEmail = splitEmail[0];

    const { success, isUsernameValid } = await this.props.onChangeUsername(
      usernameFromEmail,
    );

    success &&
      this.setState({
        setupInfo: immutable.set(
          this.state.setupInfo,
          'username',
          usernameFromEmail,
        ),
        isUsernameValid,
      });
  }

  onChangeUsernameValue = async username => {
    this.setState({
      setupInfo: immutable.set(this.state.setupInfo, 'username', username),
    });
    const { success, isUsernameValid } = await this.props.onChangeUsername(
      username,
    );

    success &&
      this.setState({
        isUsernameValid,
      });
  };

  onCountryChange = e => {
    this.setState({
      setupInfo: immutable.set(this.state.setupInfo, 'country', e.target.value),
    });
  };

  onSelectLocation = (address, lat, lng) => {
    this.setState({
      setupInfo: immutable
        .wrap(this.state.setupInfo)
        .set('address', address)
        .set('lat', lat)
        .set('lng', lng)
        .value(),
    });
  };

  onDetermineButtonStatus = () => {
    const { setupInfo, isUsernameValid } = this.state;
    const { address, lat, lng } = setupInfo;

    if (isUsernameValid && address !== '' && lat !== '' && lng !== '') {
      return 'active';
    } else {
      return 'inactive';
    }
  };

  onSubmitSetupInfo = e => {
    e.preventDefault();
    this.props.onSubmitUserSetup(this.state.setupInfo);
  };

  renderSignUpContainer() {
    return;
  }

  render() {
    console.log(this.state);

    return (
      <ReactModal
        isOpen={true}
        // onAfterOpen={}
        // onRequestClose={}
        // style={}
        className={ModalStyle.Modal}
        overlayClassName={ModalStyle.Overlay}
        contentLabel="Example Modal"
      >
        <div className={ModalStyle.header}>
          <h2>Setup</h2>
        </div>
        <div className={ModalStyle.body}>
          <div className={ModalStyle.authContainer}>
            <form className={ModalStyle.Form} onSubmit={this.onSubmitSetupInfo}>
              <div style={{ marginBottom: '30px' }}>
                <p className={ModalStyle.Message}>
                  Select Username (Can be changed later)
                </p>
                <TextInput
                  name={'username'}
                  onChange={value => this.onChangeUsernameValue(value)}
                  value={this.state.setupInfo['username']}
                  className={ModalStyle.formInput}
                />
                <p
                  className={
                    this.state.isUsernameValid
                      ? ModalStyle.validUsername
                      : ModalStyle.invalidUsername
                  }
                >
                  {this.state.isUsernameValid
                    ? 'Username is Valid'
                    : 'Username is Invalid/Taken'}
                </p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <p className={ModalStyle.Message}>
                  Select approx. Location to find & create listings for Local
                  Marketplace
                </p>
                <LocationSearchInput
                  address={this.state.setupInfo.address}
                  latitude={this.state.setupInfo.lat}
                  longitude={this.state.setupInfo.lng}
                  onSelectLocation={this.onSelectLocation}
                />
              </div>

              <div>
                <p className={ModalStyle.Message}>Select Buy/Sell Country</p>

                <div className={ModalStyle.countrySelector}>
                  <select
                    class={ModalStyle.countrySelect}
                    aria-label="country"
                    value={this.state.setupInfo.country}
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
                </div>
              </div>

              <div>
                <Button
                  className={ModalStyle.ModalButton}
                  name="Submit"
                  status={this.onDetermineButtonStatus()}
                >
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ReactModal>
    );
  }
}
