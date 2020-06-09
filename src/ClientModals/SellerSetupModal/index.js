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

const stripeConnectButton = require('assets/Images/blue-on-dark.png');

export default class SellerSetupModal extends Component {
  renderStripeConnectButton = () => {
    if (this.props.stripe_connect_account_status === 'active') {
      return <div>Account already Created.</div>;
    }
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <a href={this.props.stripeConnectOnboardingUrl}>
          <img
            alt="Connect with Stripe"
            style={{ height: '35px' }}
            src={stripeConnectButton}
          />
        </a>
      </div>
    );
  };

  renderCreateAddressButton = () => {
    if (this.props.activeSellerAddressID !== '') {
      return <div>Address already Created.</div>;
    }

    return (
      <button
        style={{
          background: 'black',
          height: '35px',
          color: 'white',
          width: '200px',
          fontSize: '14px',
          fontFamily: 'Roboto, sans-serif',
        }}
      >
        Create Address
      </button>
    );
  };

  renderMessageContainer = () => {
    return (
      <div>
        <div>
          <div className={ModalStyle.StepsContainer}>
            <div className={ModalStyle.Step}>
              <div className={ModalStyle.StepTitleContainer}>
                <span className={ModalStyle.StepCount}>1</span>
                <h4 className={ModalStyle.StepTitle}>Connect Stripe Account</h4>
              </div>
              <div className={ModalStyle.StepDescription}>
                Create a Stripe Account to Receive payments when your listings
                are sold. Learn more.
              </div>
              <div>{this.renderStripeConnectButton()}</div>
            </div>
            <div className={ModalStyle.Step}>
              <div className={ModalStyle.StepTitleContainer}>
                <span className={ModalStyle.StepCount}>2</span>
                <h4 className={ModalStyle.StepTitle}>Enter Seller Address</h4>
              </div>
              <div className={ModalStyle.StepDescription}>
                Enter an address where you will receiving your shipping. You can
                change this anytime from your settings.
              </div>
              <div>{this.renderCreateAddressButton()}</div>
            </div>
          </div>
          {/* <div className={ModalStyle.dontCancelContainer}>
              <span className={ModalStyle.points}>10pts</span>
              <h5>
                Penalty for cancelletion after receiving order is 10 points off
                your reseller score.
              </h5>
            </div> */}
          <Button
            className={ModalStyle.ModalButton}
            onClick={() => this.props.onClose()}
          >
            OKAY, I UNDERSTAND
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <ReactModal
        isOpen={true}
        className={ModalStyle.Modal}
        overlayClassName={ModalStyle.Overlay}
        contentLabel="Example Modal"
      >
        <div className={ModalStyle.header}>
          <h2 className={ModalStyle.title}>SELLER SETUP</h2>
          <h5>To create a listing, complete the following steps</h5>
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
