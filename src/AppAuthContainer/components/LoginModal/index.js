import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { CloseIcon } from 'assets/Icons';

import { Button, TextInput } from 'fields';

import * as immutable from 'object-path-immutable';

import { isEmailValid } from './helper';

import { GoogleLogin } from 'react-google-login';

export default class LoginModal extends Component {
  state = {
    loginWithEmail: false,
    loginInfo: {
      email: '',
      password: '',
    },
  };

  onLoginWithEmail = e => {
    e.preventDefault();
    console.log('on submit signup');
    this.props.onLoginWithEmail(this.state.loginInfo);
  };

  onDetermineButtonStatus = () => {
    const { email, password } = this.state.loginInfo;
    const buttonStatus =
      isEmailValid(email) && password.length > 0 ? 'active' : 'inactive';
    return buttonStatus;
  };

  onChangeTextInputValue = (fieldID, value) => {
    const loginInfo = immutable.set(this.state.loginInfo, fieldID, value);
    this.setState({ loginInfo }, this.onGetSubmitBtnStatus);
  };

  onLoginWithGoogle = response => {
    console.log(response);
    this.props.onLoginWithGoogle(response.accessToken);
  };

  onLoginWithGoogleFail = error => {
    console.log(error);
  };

  renderLoginContainer() {
    return (
      <div>
        <GoogleLogin
          clientId="516409520927-4sl33hnsnkremqjskn8qbq97s6ncslrm.apps.googleusercontent.com"
          buttonText="Login With Google"
          onSuccess={this.onLoginWithGoogle}
          onFailure={this.onLoginWithGoogleFail}
          cookiePolicy={'single_host_origin'}
          className={ModalStyle.googleButton}
        />
        <button
          className={ModalStyle.ModalButton}
          onClick={() => this.setState({ loginWithEmail: true })}
        >
          {' '}
          Login with Email
        </button>
        <p className={ModalStyle.Message}>
          Don't have an account?{' '}
          <button className={ModalStyle.linkButton}>Sign Up</button>
        </p>
      </div>
    );
  }

  renderLoginWithEmail() {
    return (
      <div>
        <button
          className={ModalStyle.linkButton}
          onClick={() => this.setState({ loginWithEmail: false })}
        >
          Back
        </button>
        <form className={ModalStyle.Form} onSubmit={this.onLoginWithEmail}>
          <TextInput
            label={'Email'}
            name={'email'}
            onChange={value => this.onChangeTextInputValue('email', value)}
            value={this.state.loginInfo['email']}
            className={ModalStyle.formInput}
          />
          <TextInput
            label={'Password'}
            name={'password'}
            onChange={value => this.onChangeTextInputValue('password', value)}
            value={this.state.loginInfo['password']}
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
          <h2>Log In</h2>
        </div>
        <div className={ModalStyle.body}>
          <div className={ModalStyle.authContainer}>
            {!this.state.loginWithEmail
              ? this.renderLoginContainer()
              : this.renderLoginWithEmail()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
