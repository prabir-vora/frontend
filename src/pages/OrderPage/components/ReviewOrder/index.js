import React, { Component } from 'react';

import Style from '../style.module.scss';

import { Button, Img, RadioButton } from 'fields';

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

  onSubmitOrder = e => {
    e.preventDefault();

    this.props.onPurchaseOrder();
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
            <div className={Style.PaymentListItem} key={payment.id}>
              <div
                style={{ display: 'flex', marginBottom: '20px' }}
                className={Style.PaymentListItemContent}
              >
                <RadioButton
                  checked={payment.id === this.state.activePaymentID}
                  id={payment.id}
                  label={''}
                  onClick={() =>
                    this.setState({
                      activePaymentID: payment.id,
                    })
                  }
                />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {this.renderCardBrand(card_brand)} {last_4_digits}
                </div>
              </div>
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
            <div className={Style.ShippingListItem} key={address.id}>
              <div className={Style.ShippingListItemContent}>
                <RadioButton
                  checked={address.id === this.state.activeShippingID}
                  id={address.id}
                  label={addressLabel}
                  onClick={() =>
                    this.setState({
                      activeShippingID: address.id,
                    })
                  }
                />
              </div>
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
          <h3 className={Style.OrderReviewSummaryDetailTitle}>SHIP TO</h3>
          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div className={Style.addressLabel}>
                {address1} {address2}, {city_locality} {state_province},{' '}
                {country_code}, {postal_code}
              </div>
              <div>{phone}</div>
            </div>
            <button
              className={Style.OrderReviewSummaryDetailEditLink}
              onClick={() => this.onClickEdit('shipping')}
            >
              EDIT
            </button>
          </div>
        </div>
        <div className={Style.OrderReviewSummaryDetail}>
          <h3 className={Style.OrderReviewSummaryDetailTitle}>PAYMENT</h3>
          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.renderCardBrand(card_brand)} {last_4_digits}
              </div>
            </div>
            <button
              className={Style.OrderReviewSummaryDetailEditLink}
              onClick={() => this.onClickEdit('payment')}
            >
              EDIT
            </button>
          </div>
        </div>
        <div className={Style.OrderReviewSummaryDetail}>
          <h3 className={Style.OrderReviewSummaryDetailTitle}>ORDER SUMMARY</h3>
          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div>
                <div className={Style.priceSummary}>
                  <div>Subtotal</div>
                  <div>${price_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div>Shipping</div>
                  <div>${shipping_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div>Total</div>
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
            <br />
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
            <br />
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
          <Button
            className={Style.submitButton}
            status={this.determinePaymentBtnStatus()}
            name="submit"
          >
            CONFIRM ORDER
          </Button>
        </form>
      </div>
    );
  }
}
