import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import ReactCodeInput from 'react-code-input';

import { Button } from 'fields';
import { ClipLoader } from 'react-spinners';

export default class VerificationModal extends Component {
  state = {
    authCode: '',
    errorMessage: '',
    authCodeResent: false,
    resendingAuthCode: false,
  };

  onChangeVerificationCode = async authCode => {
    this.setState({ authCode });
    console.log(authCode);

    if (authCode.length === 6) {
      const { success } = await this.props.submitVerificationCode(authCode);
      if (!success) {
        this.setState({ errorMessage: 'Invalid Code' });
      }
    }
  };

  render() {
    const { user } = this.props;
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
        {this.state.resendingAuthCode ? (
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
        ) : (
          <React.Fragment>
            <div className={ModalStyle.verificationHeader}>
              <h2>Enter Verification Code</h2>
              <p>
                As an added security measure, please enter the 6-digit code sent
                to {user.email}
              </p>
              <p
                style={{ color: 'green', marginTop: '15px', fontSize: '12px' }}
              >
                {this.state.authCodeResent ? 'Auth Code Resent' : null}
              </p>
            </div>
            <div className={ModalStyle.body}>
              <ReactCodeInput
                type="number"
                fields={6}
                value={this.state.authCode}
                onChange={authCode => this.onChangeVerificationCode(authCode)}
              />
              <br />
              <p className={ModalStyle.invalidUsername}>
                {this.state.errorMessage}
              </p>
              <br />
              <button
                className={ModalStyle.linkButton}
                onClick={async () => {
                  this.setState({
                    resendingAuthCode: true,
                  });
                  const { success } = await this.props.onResendCode();

                  if (success) {
                    this.setState({
                      authCodeResent: true,
                      resendingAuthCode: false,
                    });
                  } else {
                    this.setState({
                      resendingAuthCode: false,
                    });
                  }
                }}
              >
                Resend Code
              </button>
            </div>
          </React.Fragment>
        )}
      </ReactModal>
    );
  }
}
