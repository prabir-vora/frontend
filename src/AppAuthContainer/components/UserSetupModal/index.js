import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { Button, TextInput, LocationSearchInput } from 'fields';

import * as immutable from 'object-path-immutable';

import SetupMapContainer from 'components/SetupMapContainer';

export default class UserSetupModal extends Component {
  state = {
    setupInfo: {
      address: '',
      lat: '',
      lng: '',
      username: '',
      // country: 'US',
    },
    page: 1,
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

  // onCountryChange = e => {
  //   this.setState({
  //     setupInfo: immutable.set(this.state.setupInfo, 'country', e.target.value),
  //   });
  // };

  onSelectLocation = (address, lat, lng) => {
    console.log(address);
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
    if (this.state.page === 1) {
      return;
    }

    this.props.onSubmitUserSetup(this.state.setupInfo);
  };

  renderSignUpContainer() {
    return;
  }

  renderSetupContent = () => {
    if (this.state.page === 1) {
      return (
        <div className={ModalStyle.Form}>
          <div style={{ marginBottom: '30px' }}>
            <p className={ModalStyle.Message}>Select Username</p>
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

          <div>
            <Button
              className={ModalStyle.ModalButton}
              onClick={() => {
                this.setState({
                  page: 2,
                });
              }}
            >
              Continue
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className={ModalStyle.Form}>
          <div style={{ marginBottom: '30px' }}>
            <p className={ModalStyle.Message}>
              Enter an approx. location to discover and create listings on our
              Local Marketplace <br />
              <span style={{ fontSize: '10px', color: '#2da4b1' }}>
                Your data is confidential and not shared with third parties.{' '}
              </span>
            </p>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LocationSearchInput
                address={this.state.setupInfo.address}
                latitude={this.state.setupInfo.lat}
                longitude={this.state.setupInfo.lng}
                onSelectLocation={this.onSelectLocation}
              />
            </div>
            <div>
              {this.state.setupInfo.address && (
                <SetupMapContainer
                  _geoloc={{
                    lat: this.state.setupInfo.lat,
                    lng: this.state.setupInfo.lng,
                  }}
                  containerElement={
                    <div
                      style={{
                        height: `150px`,
                        width: '100%',
                        margin: '20px 0px',
                      }}
                    />
                  }
                  mapElement={<div style={{ height: `100%` }} />}
                />
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button
              onClick={() =>
                this.setState({
                  page: 1,
                })
              }
              className={ModalStyle.ModalButtonHalfWidth}
            >
              Back
            </Button>
            <Button
              className={ModalStyle.ModalButtonHalfWidth}
              status={this.onDetermineButtonStatus()}
              onClick={() => this.onSubmitSetupInfo()}
            >
              Submit
            </Button>
          </div>
        </div>
      );
    }
  };
  render() {
    console.log(this.state);

    return (
      <ReactModal
        isOpen={true}
        // onAfterOpen={}
        // onRequestClose={}
        // style={}
        className={ModalStyle.SetupModal}
        overlayClassName={ModalStyle.Overlay}
        contentLabel="Example Modal"
      >
        <div className={ModalStyle.header}>
          <h2>Setup</h2>
        </div>
        <div className={ModalStyle.body}>
          <div className={ModalStyle.authContainer}>
            {this.renderSetupContent()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
