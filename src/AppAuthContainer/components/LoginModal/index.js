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
      resetToken: '',
      password: '',
      confirmPassword: '',
    },
    forgotPasswordError: '',
    forgotPasswordPage: 1,
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
    console.log(this.state);
    if (this.state.showForgotPassword && this.state.forgotPasswordPage === 1) {
      const { email } = this.state.forgotPasswordInfo;
      return isEmailValid(email) ? 'active' : 'inactive';
    }
    if (this.state.showForgotPassword && this.state.forgotPasswordPage === 2) {
      const {
        resetToken,
        password,
        confirmPassword,
      } = this.state.forgotPasswordInfo;
      if (
        resetToken !== '' &&
        password !== '' &&
        password === confirmPassword
      ) {
        return 'active';
      } else {
        return 'inactive';
      }
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

  onChangeForgotPasswordField = (fieldID, value) => {
    const forgotPasswordInfo = immutable.set(
      this.state.forgotPasswordInfo,
      fieldID,
      value,
    );
    this.setState({ forgotPasswordInfo }, this.onGetSubmitBtnStatus);
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

  onResetPassword = async () => {
    const { forgotPasswordInfo } = this.state;
    const { email } = forgotPasswordInfo;
    const { success } = await this.props.onResetPassword(email);

    if (success) {
      this.setState(
        { forgotPasswordPage: 2, forgotPasswordError: '' },
        this.onGetSubmitBtnStatus,
      );
    } else {
      this.setState({
        forgotPasswordError: 'Something went wrong. Ensure correct email.',
      });
    }
  };

  onClickExistingCode = () => {
    const { forgotPasswordInfo } = this.state;
    const { email } = forgotPasswordInfo;

    return isEmailValid(email)
      ? this.setState({
          forgotPasswordPage: 2,
          forgotPasswordError: '',
        })
      : this.setState({
          forgotPasswordError: 'Enter correct email to proceed.',
        });
  };

  onSubmitResetPasswordInfo = async e => {
    e.preventDefault();

    const { forgotPasswordInfo } = this.state;
    const { email, resetToken, password } = forgotPasswordInfo;
    const { success, error } = await this.props.onSubmitResetPasswordInfo(
      email,
      resetToken,
      password,
    );

    if (success) {
      this.setState({
        showForgotPassword: false,
        forgotPasswordInfo: {
          email: '',
          resetToken: '',
          password: '',
          confirmPassword: '',
        },
        forgotPasswordError: '',
        forgotPasswordPage: 1,
      });
    } else {
      this.setState({
        forgotPasswordError: error,
      });
    }
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
    if (this.state.forgotPasswordPage === 1) {
      return (
        <div>
          <button
            className={ModalStyle.linkButton}
            onClick={() => this.setState({ showForgotPassword: false })}
          >
            Back
          </button>
          <div className={ModalStyle.Form}>
            <TextInput
              label={'Email'}
              name={'email'}
              onChange={value =>
                this.onChangeForgotPasswordField('email', value)
              }
              value={this.state.forgotPasswordInfo['email']}
              className={ModalStyle.formInput}
            />
            <Button
              className={ModalStyle.ModalButton}
              onClick={() => this.onResetPassword()}
              status={this.onDetermineButtonStatus()}
            >
              Reset Password
            </Button>
            <div style={{ margin: '15px 0px' }}>
              {this.state.forgotPasswordError && (
                <p>{this.state.forgotPasswordError}</p>
              )}
            </div>
            <Button
              className={ModalStyle.linkButton}
              onClick={() => this.onClickExistingCode()}
            >
              Already have a reset code?
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div>
        {/* <button
          className={ModalStyle.linkButton}
          onClick={() => this.setState({ loginWithEmail: false })}
        >
          Back
        </button> */}
        <form
          className={ModalStyle.Form}
          onSubmit={this.onSubmitResetPasswordInfo}
        >
          <TextInput
            label={'Reset password code'}
            name={'resetCode'}
            onChange={value =>
              this.onChangeForgotPasswordField('resetToken', value)
            }
            value={this.state.forgotPasswordInfo['resetToken']}
            className={ModalStyle.formInput}
          />
          <TextInput
            label={'Password'}
            name={'password'}
            onChange={value =>
              this.onChangeForgotPasswordField('password', value)
            }
            value={this.state.forgotPasswordInfo['password']}
            className={ModalStyle.formInput}
            type="password"
          />
          <TextInput
            label={'Re-type Password'}
            name={'password'}
            onChange={value =>
              this.onChangeForgotPasswordField('confirmPassword', value)
            }
            value={this.state.forgotPasswordInfo['confirmPassword']}
            className={ModalStyle.formInput}
            type="password"
          />
          <Button
            className={ModalStyle.ModalButton}
            name="submit"
            status={this.onDetermineButtonStatus()}
          >
            Submit
          </Button>
          <p>{this.state.forgotPasswordError}</p>
          <br />
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
