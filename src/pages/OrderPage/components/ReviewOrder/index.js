import React, { Component } from 'react';

import Style from '../style.module.scss';

import { RadioButtonCheckedIcon, RadioButtonUncheckedIcon } from 'assets/Icons';

import { Button, Img } from 'fields';

import { ClipLoader } from 'react-spinners';

const visaImage = require('assets/Images/visa.png');
const mastercardImage = require('assets/Images/mastercard.png');
const amexImage = require('assets/Images/amex.png');
const discoverImage = require('assets/Images/discover.png');

export default class ReviewOrder extends Component {
  state = {
    changeShipping: false,
    changePayment: false,
    activeShippingID: '',
    activePaymentID: '',
    confirmingOrder: false,
    errorMessage: '',
  };

  componentDidMount() {
    const { orderDetails } = this.props;
    const { buyerAddress, billingInfo } = orderDetails;
    this.setState({
      activeShippingID: buyerAddress.id,
      activePaymentID: billingInfo.id,
    });
  }

  determinePaymentBtnStatus = () => {
    if (this.props.ongoingPayment) {
      return 'inactive';
    } else {
      return 'active';
    }
  };

  onChangeShippingAddress = async () => {
    const { updated, message } = await this.props.updateShippingAddress(
      this.state.activeShippingID,
    );

    if (!updated && message) {
      this.setState({
        errorMessage: message,
      });
    }

    console.log(updated);

    if (updated) {
      this.setState({
        changeShipping: false,
      });
    }
  };

  onChangePaymentMethod = async () => {
    const { updated, message } = await this.props.updatePaymentMethod(
      this.state.activePaymentID,
    );

    if (!updated && message) {
      this.setState({
        errorMessage: message,
      });
    }

    console.log(updated);

    if (updated) {
      this.setState({
        changePayment: false,
      });
    }
  };

  onSubmitOrder = async e => {
    e.preventDefault();

    this.setState({
      confirmingOrder: true,
    });

    const { success } = await this.props.onPurchaseOrder();

    if (success) {
      this.setState({
        confirmingOrder: false,
      });
    } else {
      this.setState({
        errorMessage: 'Something went wrong. Try again.',
        confirmingOrder: false,
      });
    }
  };

  goBack = () => {
    this.setState({
      changeShipping: false,
      changePayment: false,
    });
  };

  onGetButtonStatus = () => {
    const { orderDetails } = this.props;
    const { buyerAddress, billingInfo } = orderDetails;

    if (this.state.changeShipping) {
      if (this.state.activeShippingID !== buyerAddress.id) {
        return 'active';
      } else {
        return 'inactive';
      }
    } else {
      if (this.state.activePaymentID !== billingInfo.id) {
        return 'active';
      } else {
        return 'inactive';
      }
    }
  };

  onClickEdit = id => {
    console.log(id);
    switch (id) {
      case 'shipping':
        return this.setState({ changeShipping: true });
      case 'payment':
        return this.setState({ changePayment: true });
      default:
        return;
    }
  };

  renderCardBrand = card_brand => {
    switch (card_brand) {
      case 'visa':
        return <Img src={visaImage} className={Style.cardBrandImage} />;
      case 'mastercard':
        return <Img src={mastercardImage} className={Style.cardBrandImage} />;
      default:
        return null;
    }
  };

  renderChangePayment = () => {
    const { orderDetails, user } = this.props;
    const { billingInfo } = orderDetails;

    const { paymentMethods } = user;

    return (
      <div className={Style.PaymentListContainer}>
        {paymentMethods.map(payment => {
          const { card_brand, last_4_digits } = payment;
          return (
            <div
              style={{ display: 'flex', marginBottom: '20px' }}
              className={Style.PaymentListItemContent}
            >
              <button
                onClick={() =>
                  this.setState({
                    activePaymentID: payment.id,
                  })
                }
                className={Style.ListItemButton}
              >
                {payment.id === this.state.activePaymentID ? (
                  <RadioButtonCheckedIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
                {this.renderCardBrand(card_brand)} {last_4_digits}
              </button>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              this.props.onAddNewPayment();
            }}
            className={Style.addNewButton}
          >
            ADD CARD +
          </Button>
        </div>
        <Button className={Style.submitButton} onClick={() => this.goBack()}>
          Back
        </Button>
        <Button
          className={Style.submitButton}
          name="submit"
          onClick={() => this.onChangePaymentMethod()}
          status={this.onGetButtonStatus()}
        >
          Confirm
        </Button>
      </div>
    );
  };

  renderChangeShipping = () => {
    const { orderDetails, user } = this.props;
    const { buyerAddress } = orderDetails;

    const { addresses } = user;

    return (
      <div className={Style.ShippingListContainer}>
        {addresses.map(address => {
          const {
            address1,
            address2,
            city_locality,
            country_code,
            phone,
            postal_code,
            state_province,
          } = address;
          const addressLabel = `${address1} ${address2}, ${city_locality}, ${state_province}, ${country_code}, ${postal_code}`;

          return (
            <div className={Style.shippingListItem} key={address.id}>
              <button
                onClick={() =>
                  this.setState({
                    activeShippingID: address.id,
                  })
                }
                className={Style.ListItemButton}
              >
                {address.id === this.state.activeShippingID ? (
                  <RadioButtonCheckedIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
                {addressLabel}
              </button>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              this.props.onAddNewAddress();
            }}
            className={Style.addNewButton}
          >
            ADD ADDRESS +
          </Button>
        </div>
        <Button className={Style.submitButton} onClick={() => this.goBack()}>
          Back
        </Button>
        <Button
          className={Style.submitButton}
          name="submit"
          onClick={() => this.onChangeShippingAddress()}
          status={this.onGetButtonStatus()}
        >
          Confirm
        </Button>
      </div>
    );
  };

  renderOrderDetails = () => {
    const { orderDetails, user } = this.props;
    const {
      billingInfo,
      buyerAddress,
      price_cents,
      shipping_cents,
      total_price_cents,
    } = orderDetails;

    const {
      address1,
      address2,
      city_locality,
      country_code,
      phone,
      postal_code,
      state_province,
    } = buyerAddress;

    const { card_brand, last_4_digits } = billingInfo;

    return (
      <div>
        <div className={Style.OrderReviewSummaryDetail}>
          <div className={Style.OrderReviewTitleContainer}>
            <h3 className={Style.OrderReviewSummaryDetailTitle}>Ship To</h3>
            <button
              className={Style.OrderReviewSummaryDetailEditLink}
              onClick={() => this.onClickEdit('shipping')}
            >
              EDIT
            </button>
          </div>

          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div className={Style.addressLabel}>
                {address1} {address2}, {city_locality} {state_province},{' '}
                {country_code}, {postal_code}
              </div>
              <div>{phone}</div>
            </div>
          </div>
        </div>
        <div className={Style.OrderReviewSummaryDetail}>
          <div className={Style.OrderReviewTitleContainer}>
            <h3 className={Style.OrderReviewSummaryDetailTitle}>Payment</h3>
            <button
              className={Style.OrderReviewSummaryDetailEditLink}
              onClick={() => this.onClickEdit('payment')}
            >
              EDIT
            </button>
          </div>

          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.renderCardBrand(card_brand)} {last_4_digits}
              </div>
            </div>
          </div>
        </div>
        <div className={Style.OrderReviewSummaryDetail}>
          <div className={Style.OrderReviewTitleContainer}>
            <h3 className={Style.OrderReviewSummaryDetailTitle}>Price</h3>
          </div>
          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div>
                <div className={Style.priceSummary}>
                  <div style={{ marginRight: '20px' }}>Subtotal</div>
                  <div>${price_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div style={{ marginRight: '20px' }}>Shipping</div>
                  <div>${shipping_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div style={{ marginRight: '20px' }}>Total</div>
                  <div>${total_price_cents / 100}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    console.log(this.props);

    const { changePayment, changeShipping } = this.state;

    if (changeShipping) {
      return (
        <div className={Style.formContainer}>
          <h1 className={Style.title}>CHANGE SHIPPING</h1>
          <div className={Style.form}>
            {this.renderChangeShipping()}
            <br />
          </div>
        </div>
      );
    }

    if (changePayment) {
      return (
        <div className={Style.formContainer}>
          <h1 className={Style.title}>CHANGE PAYMENT</h1>
          <div className={Style.form}>
            {this.renderChangePayment()}
            <br />
          </div>
        </div>
      );
    }

    return (
      <div className={Style.formContainer}>
        <h1 className={Style.title}>REVIEW</h1>
        <form className={Style.form} onSubmit={e => this.onSubmitOrder(e)}>
          <br />
          {this.renderOrderDetails()}
          <br />
          <div className={Style.errorMessage}>{this.state.errorMessage}</div>
          <br />
          {!this.state.confirmingOrder ? (
            <div className={Style.buttonsContainer}>
              {/* {this.props.addNewAddress && (
                <Button
                  className={Style.submitButton}
                  onClick={() => this.props.goBack()}
                >
                  Back
                </Button>
              )} */}
              <Button
                className={Style.submitButton}
                status={this.determinePaymentBtnStatus()}
                name="submit"
              >
                CONFIRM
              </Button>
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <ClipLoader width={'30px'} color={'#fff'} />
              <div>Confirming Payment. Do not close.</div>
            </div>
          )}
        </form>
      </div>
    );
  }
}
