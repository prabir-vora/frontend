import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { CloseIcon } from 'assets/Icons';

import { Button, TextInput } from 'fields';

import * as immutable from 'object-path-immutable';

import { isEmailValid } from './helper';

import { GoogleLogin } from 'react-google-login';

export default class SignUpModal extends Component {
  state = {
    signUpWithEmail: false,
    signUpInfo: {
      name: '',
      email: '',
      password: '',
    },
  };

  onSignUpWithEmail = e => {
    e.preventDefault();
    console.log('on submit signup');
  };

  onDetermineButtonStatus = () => {
    const { email, password } = this.state.signUpInfo;
    const buttonStatus =
      isEmailValid(email) && password.length > 0 ? 'active' : 'inactive';
    return buttonStatus;
  };

  onChangeTextInputValue = (fieldID, value) => {
    const signUpInfo = immutable.set(this.state.signUpInfo, fieldID, value);
    this.setState({ signUpInfo }, this.onGetSubmitBtnStatus);
  };

  onSignUpWithGoogle = response => {
    console.log(response);
    this.props.onSignUpWithGoogle(response.accessToken);
  };

  onSignUpWithGoogleFail = error => {
    console.log(error);
  };

  toggleToLogin = () => {
    this.props.toggleToLogin();
  };

  renderSignUpContainer() {
    return (
      <div>
        <p className={ModalStyle.Message}>
          Create an account to Shop resell items, Browse local listings, Find
          resellers, and much more...
        </p>
        <GoogleLogin
          clientId="516409520927-4sl33hnsnkremqjskn8qbq97s6ncslrm.apps.googleusercontent.com"
          buttonText="Sign Up With Google"
          onSuccess={this.onSignUpWithGoogle}
          onFailure={this.onSignUpWithGoogleFail}
          cookiePolicy={'single_host_origin'}
          className={ModalStyle.googleButton}
        />
        <button
          className={ModalStyle.ModalButton}
          onClick={() => this.setState({ signUpWithEmail: true })}
        >
          {' '}
          Sign up with Email
        </button>
        <p className={ModalStyle.Message}>
          Already have an account{' '}
          <button
            className={ModalStyle.linkButton}
            onClick={this.toggleToLogin}
          >
            Log in
          </button>
        </p>
      </div>
    );
  }

  renderSignUpWithEmail() {
    return (
      <div>
        <button
          className={ModalStyle.linkButton}
          onClick={() => this.setState({ signUpWithEmail: false })}
        >
          Back
        </button>
        <form className={ModalStyle.Form} onSubmit={this.onSignUpWithEmail}>
          <TextInput
            label={'Name'}
            name={'name'}
            onChange={value => this.onChangeTextInputValue('name', value)}
            value={this.state.signUpInfo['name']}
            className={ModalStyle.formInput}
          />
          <TextInput
            label={'Email'}
            name={'email'}
            onChange={value => this.onChangeTextInputValue('email', value)}
            value={this.state.signUpInfo['email']}
            className={ModalStyle.formInput}
          />
          <TextInput
            label={'Password'}
            name={'password'}
            onChange={value => this.onChangeTextInputValue('password', value)}
            value={this.state.signUpInfo['password']}
            className={ModalStyle.formInput}
            type="password"
          />
          <Button
            className={ModalStyle.ModalButton}
            name="Sign Up"
            status={this.onDetermineButtonStatus()}
          >
            Sign Up
          </Button>
        </form>
      </div>
    );
  }

  render() {
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
        <button
          className={ModalStyle.close}
          onClick={() => this.props.onClose()}
        >
          <CloseIcon />
        </button>
        <div className={ModalStyle.header}>
          <h2>Sign Up</h2>
        </div>
        <div className={ModalStyle.body}>
          <div className={ModalStyle.authContainer}>
            {!this.state.signUpWithEmail
              ? this.renderSignUpContainer()
              : this.renderSignUpWithEmail()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
