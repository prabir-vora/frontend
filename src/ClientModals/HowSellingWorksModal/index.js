import React, { Component } from 'react';

import ReactModal from 'react-modal';

import ModalStyle from './style.module.scss';

import { Button, TextInput } from 'fields';

import {
  CreateListingIcon,
  EngageMessagesIcon,
  PackageIcon,
  CashOutIcon,
} from 'assets/Icons';

export default class HowSellingWorksModal extends Component {
  onCloseModal = () => {
    this.props.onCloseModal();
  };

  renderMessageContainer() {
    return (
      <div>
        <div>
          <div className={ModalStyle.StepsContainer}>
            <div className={ModalStyle.Step}>
              <CreateListingIcon />
              <div className={ModalStyle.StepTitleContainer}>
                <span className={ModalStyle.StepCount}>1</span>
                <h4 className={ModalStyle.StepTitle}>Create Listing</h4>
              </div>
              <div className={ModalStyle.StepDescription}>
                List a product for Sale. Upload Quality Images and mention all
                condition details.
              </div>
            </div>
            <div className={ModalStyle.Step}>
              <EngageMessagesIcon />
              <div className={ModalStyle.StepTitleContainer}>
                <span className={ModalStyle.StepCount}>2</span>
                <h4 className={ModalStyle.StepTitle}>Respond</h4>
              </div>
              <div className={ModalStyle.StepDescription}>
                Respond to customer messages on your listings. These could be
                about condition, pricing, etc.
              </div>
            </div>
            <div className={ModalStyle.Step}>
              <PackageIcon />
              <div className={ModalStyle.StepTitleContainer}>
                <span className={ModalStyle.StepCount}>3</span>
                <h4 className={ModalStyle.StepTitle}>Ship</h4>
              </div>
              <div className={ModalStyle.StepDescription}>
                On receiving order, ship your product in 2 business days using
                our pre-paid shipping label.
              </div>
            </div>
            <div className={ModalStyle.Step}>
              <CashOutIcon />
              <div className={ModalStyle.StepTitleContainer}>
                <span className={ModalStyle.StepCount}>4</span>
                <h4 className={ModalStyle.StepTitle}>Cash Out</h4>
              </div>
              <div className={ModalStyle.StepDescription}>
                We release the funds to you. Cash out whenever you wish. No
                looking back!
              </div>
            </div>
          </div>
          <div className={ModalStyle.dontCancelContainer}>
            <span className={ModalStyle.points}>10pts</span>
            <h5>
              Penalty for cancelletion after receiving order is 10 points off
              your reseller score.
            </h5>
          </div>
          <Button
            className={ModalStyle.ModalButton}
            onClick={this.onCloseModal}
          >
            OKAY, I UNDERSTAND
          </Button>
        </div>
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
        <div className={ModalStyle.header}>
          <h2 className={ModalStyle.title}>HOW SELLING WORKS</h2>
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
