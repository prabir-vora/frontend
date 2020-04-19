import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from '../style.module.scss';

import { CloseIcon } from 'assets/Icons';

import { Button, TextInput } from 'fields';

export default class ReplyModal extends Component {
  state = {
    message: '',
  };

  onSendReply = e => {
    e.preventDefault();
    console.log('on send message');
    const { success } = this.props.onSendReply(this.state.message);
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

  renderReplyContainer() {
    return (
      <div>
        <form className={ModalStyle.Form} onSubmit={this.onSendReply}>
          <TextInput
            label={'Reply'}
            name={'message'}
            onChange={value => this.onChangeTextInputValue('message', value)}
            value={this.state.message}
            hasMultipleLines={true}
            className={ModalStyle.formInput}
            placeholder={
              'Send a message regarding price, condition, shipping, etc.'
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
          <h2>Reply</h2>
        </div>
        <div className={ModalStyle.body}>
          <div className={ModalStyle.authContainer}>
            {this.renderReplyContainer()}
          </div>
        </div>
      </ReactModal>
    );
  }
}
