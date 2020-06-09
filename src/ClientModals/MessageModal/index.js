import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { CloseIcon } from 'assets/Icons';

import { Button, TextInput } from 'fields';

export default class MessageModal extends Component {
  state = {
    message: '',
  };

  onSendMessage = e => {
    e.preventDefault();
    console.log('on send message');
    const { success } = this.props.onSendMessage(this.state.message);
    if (!success) {
      this.setState({
        error: 'Failed to Send message',
      });
    }
  };

  onDetermineButtonStatus = () => {
    const { message } = this.state;
    const buttonStatus = message.length > 0 ? 'active' : 'inactive';
    return buttonStatus;
  };

  onChangeTextInputValue = (fieldID, value) => {
    this.setState({ [fieldID]: value }, this.onGetSubmitBtnStatus);
  };

  renderMessageContainer() {
    return (
      <div>
        <form className={ModalStyle.Form} onSubmit={this.onSendMessage}>
          <TextInput
            label={'Message'}
            name={'message'}
            onChange={value => this.onChangeTextInputValue('message', value)}
            value={this.state.message}
            hasMultipleLines={true}
            className={ModalStyle.formInput}
            placeholder={
              'Send a message regarding price, condition, meeting up, etc.'
            }
          />
          <Button
            className={ModalStyle.ModalButton}
            name="Submit"
            status={this.onDetermineButtonStatus()}
          >
            Send
          </Button>
        </form>
      </div>
    );
  }

  render() {
    return (
      <ReactModal
        isOpen={true}
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
          <h2>Send a Message</h2>
        </div>
        <div className={ModalStyle.body}>
          <div className={ModalStyle.authContainer}>
            {this.renderMessageContainer()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
