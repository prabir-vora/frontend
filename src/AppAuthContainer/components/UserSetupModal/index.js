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
              <div style={{ marginBottom: '20px' }}>
                <TextInput
                  label={'Username'}
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
                    : 'Username is Invalid'}
                </p>
              </div>

              <div>
                <p className={ModalStyle.Message}>
                  Select Address to be used to find nearby listings for Local
                  Marketplace
                </p>
                <LocationSearchInput
                  address={this.state.setupInfo.address}
                  latitude={this.state.setupInfo.lat}
                  longitude={this.state.setupInfo.lng}
                  onSelectLocation={this.onSelectLocation}
                />
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
