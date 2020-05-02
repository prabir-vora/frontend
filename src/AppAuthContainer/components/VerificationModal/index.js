import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import ReactCodeInput from 'react-code-input';

import { Button } from 'fields';

export default class VerificationModal extends Component {
  state = { authCode: '', errorMessage: '' };

  onChangeVerificationCode = authCode => {
    this.setState({ authCode });
    console.log(authCode);

    if (authCode.length === 6) {
      const { success } = this.props.submitVerificationCode(authCode);
      if (!success) {
        this.setState({ errorMessage: 'Invalid Code' });
      }
    }
  };

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
        <div className={ModalStyle.header}>
          <h2>Enter Verification Code</h2>
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
        </div>
      </ReactModal>
    );
  }
}
