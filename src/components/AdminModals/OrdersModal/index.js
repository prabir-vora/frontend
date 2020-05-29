import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

// Components
import { CenterModal, ModalBackButton } from 'fields';
// import OrderFormFields from './orderFormFields';
import ConfirmArchiveModal from '../ConfirmArchiveModal';

// Style
import ModalStyle from '../style.module.scss';
import Style from './style.module.scss';

import moment from 'moment';

class OrdersModal extends Component {
  state = {
    showLoadingModal: false,
    // All the other fields to be taken in
  };

  componentWillUnmount = () => this.setState({ showLoadingModal: false });

  // On Change Methods

  onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false });

  onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true });

  renderModalTitle = () => {
    return <h1>Edit Orders</h1>;
  };

  renderOrderDetails = () => {
    const { order } = this.props;
    const {
      resellItem,
      buyer,
      seller,
      orderNumber,
      billingInfo,
      status,
      price_cents,
      platform_fees_buyer_cents,
      total_price_cents,
      shipping_cents,
      seller_amount_made,
      platform_fees_seller_cents,
      seller_shipping_cents,
      international_checkout_note,
      seller_amount_made_cents,
      applicationFeeRateCharged,
      sellerScoreDuringPurchase,
      purchased_at,
      buyerShipment,
      sellerShipment,
    } = order;

    const { product } = resellItem;

    return (
      <div>
        <div className={Style.orderDetails}>
          <h2>Order Number #{orderNumber}</h2>
          <h2>{product.name}</h2>
          <div style={{ display: 'flex' }}>
            <h4 style={{ marginRight: '10px' }}>Buyer: {buyer.name}</h4>
            <a
              style={{
                color: 'black',
                background: 'orange',
                padding: '10px',
                margin: '10px',
              }}
              href={`mailto: ${buyer.email}`}
            >
              Send Email
            </a>
          </div>

          <div style={{ display: 'flex' }}>
            <h4 style={{ marginRight: '10px' }}> Seller: {seller.name}</h4>
            <a
              style={{
                color: 'black',
                background: 'orange',
                padding: '10px',
                margin: '10px',
              }}
              href={`mailto: ${seller.email}`}
            >
              Send Email
            </a>
          </div>
        </div>
        <div>
          <h1>Payment Info</h1>
          <h5 style={{ color: 'red' }}>Listing Price ${price_cents / 100}</h5>
          <h5 style={{ color: 'red' }}>
            Buyer Shipping ${shipping_cents / 100}
          </h5>
          <h5 style={{ color: 'red' }}>
            Seller Shipping ${seller_shipping_cents / 100}
          </h5>
          <h4>Total Price ${total_price_cents / 100} </h4>
          <h4>Seller Amount made ${seller_amount_made_cents / 100} </h4>
          <h4>
            Application Fee $
            {(total_price_cents -
              seller_shipping_cents -
              shipping_cents -
              seller_amount_made_cents) /
              100}
          </h4>
        </div>
        <div>
          <h1>Shipping Info</h1>
          <h2 style={{ color: 'orange' }}>Buyer Shipment </h2>
          <h4>Status: ${buyerShipment.status}</h4>
          <h4>
            ETA:
            {buyerShipment.eta
              ? moment(buyerShipment.eta).format('DD-MM-YYYY')
              : 'Not Found'}
          </h4>
          <div style={{ display: 'flex' }}>
            <a
              style={{
                color: 'orange',
                background: 'black',
                padding: '10px',
                margin: '10px',
              }}
              href={buyerShipment.tracking_url_provider}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tracking URL
            </a>

            <a
              style={{
                color: 'orange',
                background: 'black',
                padding: '10px',
                margin: '10px',
              }}
              href={buyerShipment.label_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              LABEL
            </a>
          </div>
        </div>
        <div>
          <h2 style={{ color: 'orange' }}>Seller Shipment </h2>
          <h4>Status: ${sellerShipment.status}</h4>
          <h4>
            ETA:
            {sellerShipment.eta
              ? moment(sellerShipment.eta).format('DD-MM-YYYY')
              : 'Not Found'}
          </h4>
          <div style={{ display: 'flex' }}>
            <a
              style={{
                color: 'orange',
                background: 'black',
                padding: '10px',
                margin: '10px',
              }}
              href={sellerShipment.tracking_url_provider}
              target="_blank"
              rel="noopener noreferrer"
            >
              Tracking URL
            </a>
            <br />
            <a
              style={{
                color: 'orange',
                background: 'black',
                padding: '10px',
                margin: '10px',
              }}
              href={sellerShipment.label_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              LABEL
            </a>
          </div>
        </div>
      </div>
    );
  };

  onSubmitOrder = async order => {
    const { actionCreators } = TestObjectsDuck;
    const { updateExistingOrder } = actionCreators;
    const res = await this.props.dispatch(updateExistingOrder(order));
    this.props.onUpdateAfterOrderSaved(res);
  };

  render() {
    const { isInEditMode, order } = this.props;
    return (
      <CenterModal
        closeModalButtonLabel={<ModalBackButton />}
        contentLabel="Create or edit item modal"
        modalBoxClassname={ModalStyle.largeCenterModalBox}
        contentContainerClassname={ModalStyle.largeCenterModalContainer}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        {this.renderOrderDetails()}
        {/* <OrderFormFields
            isInEditMode={isInEditMode}
            order={order}
            onSubmit={this.onSubmitOrder}
            sneakers={this.props.sneakers}
            apparel={this.props.apparel}
            resellers={this.props.resellers}
            sizing={this.props.sizing}
          /> */}
      </CenterModal>
    );
  }
}

OrdersModal.propTypes = {
  isInEditMode: PropTypes.bool,
  isMutating: PropTypes.bool,
  order: PropTypes.object,
  orderID: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateAfterOrderSaved: PropTypes.func,
};

OrdersModal.defaultProps = {
  isInEditMode: false,
};

const mapStateToProps = state => {
  return {
    isMutating: state[TestObjectsDuck.duckName].orders.isMutating,
    resellers: state[TestObjectsDuck.duckName].resellers.data,
    sneakers: state[AdminDuck.duckName].sneakers.data,
    apparel: state[AdminDuck.duckName].apparel.data,
    sizing: state[AdminDuck.duckName].sizing.data,
  };
};

export default connect(mapStateToProps)(OrdersModal);
