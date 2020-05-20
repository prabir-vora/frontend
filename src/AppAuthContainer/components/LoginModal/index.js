import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { CloseIcon } from 'assets/Icons';

import { Button, TextInput } from 'fields';

import * as immutable from 'object-path-immutable';

import { isEmailValid } from './helper';

import { GoogleLogin } from 'react-google-login';
import { ClipLoader } from 'react-spinners';

export default class LoginModal extends Component {
  state = {
    loginWithEmail: false,
    loginInfo: {
      email: '',
      password: '',
    },
    loginErrorMessage: '',
    showForgotPassword: false,
    forgotPasswordInfo: {
      email: '',
    },
    forgotPasswordSubmitted: false,
  };

  onLoginWithEmail = async e => {
    e.preventDefault();
    console.log('on submit signup');
    const { success } = this.props.onLoginWithEmail(this.state.loginInfo);
    if (!success) {
      this.setState({
        loginErrorMessage: 'Invalid Credentials. Try again.',
      });
    }
  };

  onDetermineButtonStatus = () => {
    if (this.state.showForgotPassword) {
      const { email } = this.state.forgotPasswordInfo;
      return isEmailValid(email) ? 'active' : 'inactive';
    }
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

  toggleToSignUp = () => {
    this.props.toggleToSignUp();
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
          <button
            className={ModalStyle.linkButton}
            onClick={this.toggleToSignUp}
          >
            Sign Up
          </button>
        </p>
      </div>
    );
  }

  renderForgotPassword() {
    return (
      <div>
        <button
          className={ModalStyle.linkButton}
          onClick={() => this.setState({ showForgotPassword: false })}
        >
          Back
        </button>
        <form className={ModalStyle.Form} onSubmit={this.onResetPassword}>
          <TextInput
            label={'Email'}
            name={'email'}
            onChange={value => this.onChangeTextInputValue('email', value)}
            value={this.state.loginInfo['email']}
            className={ModalStyle.formInput}
          />
          <Button
            className={ModalStyle.ModalButton}
            name="Login"
            status={this.onDetermineButtonStatus()}
          >
            Reset Password
          </Button>
        </form>
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
            name="Login"
            status={this.onDetermineButtonStatus()}
          >
            Login
          </Button>
          <p>{this.state.loginErrorMessage}</p>
          <br />
        </form>
        <button
          className={ModalStyle.linkButton}
          onClick={() => {
            this.setState({
              showForgotPassword: true,
              loginWithEmail: false,
            });
          }}
        >
          Forgot Password?
        </button>
      </div>
    );
  }

  renderLoginForm = () => {
    if (this.state.showForgotPassword) {
      return this.renderForgotPassword();
    }

    if (this.state.loginWithEmail) {
      return this.renderLoginWithEmail();
    } else {
      return this.renderLoginContainer();
    }
  };

  render() {
    console.log(this.state);
    if (this.props.isLoggingIn) {
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
          <div
            style={{
              height: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ClipLoader color={'#000000'} />
          </div>
        </ReactModal>
      );
    }
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
            {this.renderLoginForm()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
