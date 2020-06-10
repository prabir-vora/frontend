import React, { Component } from 'react';
import moment from 'moment';

import Style from '../style.module.scss';

import { Button, Img } from 'fields';
const visaImage = require('assets/Images/visa.png');
const mastercardImage = require('assets/Images/mastercard.png');
const amexImage = require('assets/Images/amex.png');
const discoverImage = require('assets/Images/discover.png');

export default class ItemPurchased extends Component {
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

  renderStatusText = () => {
    switch (this.props.status) {
      case 'SELLER_PENDING':
        return 'Order accepted. Awaiting Seller confirmation.';
      case 'SELLER_CANCELLED':
        return 'Order cancelled by Seller';
      case 'SHIPPED_FOR_AUTHENTICATION':
        return 'Shipped for authentication';
      case 'AUTHENTICATION_SUCCESSFUL':
        return 'Authentication successful';
      case 'AUTHENTICATION_FAILED':
        return 'Authentication Failed';
      case 'SHIPPED_TO_USER':
        return 'On its way';
      case 'REFUNDED':
        return 'Order closed. Money refunded';
      default:
        return 'Order has been accepted.';
    }
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
          {this.props.purchased_at && (
            <div className={Style.purchasedAt}>
              Purchased at {moment(this.props.purchased_at).format('MM/DD/YY')}
            </div>
          )}
        </div>
        <div className={Style.OrderReviewSummaryDetail}>
          <div className={Style.OrderReviewTitleContainer}>
            <h3 className={Style.OrderReviewSummaryDetailTitle}>Ship To</h3>
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
    return (
      <div className={Style.formContainer}>
        <h1 className={Style.title}>SUMMARY</h1>
        <div className={Style.form}>
          <br />
          {this.renderOrderDetails()}
          <br />
          <div className={Style.orderStatus}>
            {this.props.status !== 'BUYER_PENDING'
              ? this.renderStatusText()
              : 'Order has been accepted'}
          </div>
        </div>
      </div>
    );
  }
}
