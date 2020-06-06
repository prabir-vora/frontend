import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

// Icons
import { AddPhotoIcon, PencilIcon } from 'assets/Icons';

// Components
import AdminModals from 'components/AdminModals';

// Fields
import { Chip, Img } from 'fields';

// Additional Functions
import { ShowConfirmNotif } from 'functions';

// Style
// import Style from "../style.module.scss";
import Style from './style.module.scss';
import moment from 'moment';

class Order extends Component {
  confirmNotif = null;

  state = {};

  onHideEditOrderModal = () => this.setState({ showEditOrderModal: false });

  onShowEditOrderModal = () => this.setState({ showEditOrderModal: true });

  onUpdateAfterOrderSaved = success => {
    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Updated Order Status Successfuly',
        type: 'success',
      });
      this.setState({ showEditOrderModal: false }, () =>
        this.props.onRefreshAfterChanges(),
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message: 'Failed to Update Order Status',
        type: 'error',
      });
      this.setState({ showEditOrderModal: false });
    }
  };

  onShowChangePhotoModal = () => this.setState({ showChangePhotoModal: true });

  onHideChangePhotoModal = () => this.setState({ showChangePhotoModal: false });

  renderChipAvatar = () => {
    const imageURL =
      this.props.order.resellItem.product.original_image_url || '';
    return imageURL ? (
      <Img alt="" className={Style.itemImage} src={imageURL} />
    ) : (
      <div>
        <AddPhotoIcon className={Style.addPhotoIcon} />
      </div>
    );
  };

  renderChipLabel = () => {
    const { order } = this.props;
    console.log(order);
    const {
      resellItem,
      buyer,
      seller,
      total_price_cents,
      status,
      purchased_at,
      orderNumber,
    } = order;
    const { product } = resellItem;
    return (
      <React.Fragment>
        <h4 className={Style.chipName}>
          <span style={{ fontWeight: '800', marginRight: '12px' }}>
            {product.name}{' '}
          </span>
          {/* <span style={{ color: 'orange', marginRight: '12px' }}>
            Seller: {seller.name}
          </span>
          <span style={{ color: 'orange', marginRight: '12px' }}>
            Buyer: {buyer.name}
          </span> */}
          <span style={{ color: 'blue' }}>Order#: {orderNumber}</span>
        </h4>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0px',
            maxWidth: 'inherit',
            fontSize: '14px',
          }}
        >
          <h3
            style={{
              margin: '5px',
              color: 'red',
              maxWidth: 'inherit',
              overflow: 'hidden',
              fontSize: '14px',
              fontFamily: 'Helvetica',
            }}
          >
            {moment(purchased_at).format('MM-DD-YYYY')}{' '}
          </h3>
          <h3
            style={{
              margin: '5px',
              color: 'green',
              maxWidth: 'inherit',
              overflow: 'hidden',
              fontSize: '14px',
              fontFamily: 'Helvetica',
            }}
          >
            Total: ${total_price_cents / 100}{' '}
          </h3>
          <h3
            style={{
              margin: '5px',
              color: 'red',
              maxWidth: 'inherit',
              overflow: 'hidden',
              fontSize: '14px',
              fontFamily: 'Helvetica',
            }}
          >
            Status: {status}{' '}
          </h3>
        </div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.OrdersModal
      isInEditMode={true}
      order={this.props.order}
      onCloseModal={this.onHideEditOrderModal}
      onUpdateAfterOrderArchived={this.onUpdateAfterOrderArchived}
      onUpdateAfterOrderSaved={this.onUpdateAfterOrderSaved}
    />
  );

  renderHelperButton = () => {
    return (
      <PencilIcon
        className={Style.pencilIcon}
        onClick={this.onShowEditOrderModal}
      />
    );
  };

  renderOrder = () => (
    <div className={Style.chipContainer}>
      <Chip
        avatar={this.renderChipAvatar()}
        label={this.renderChipLabel()}
        helperButtonContent={this.renderHelperButton()}
      />
      {/* {this.renderSigns()} */}
    </div>
  );

  render() {
    return (
      <React.Fragment>
        {this.state.showChangePhotoModal && this.renderChangePhotoModal()}
        {this.state.showEditOrderModal && this.renderEditModal()}
        {this.props.order && this.renderOrder()}
      </React.Fragment>
    );
  }
}

Order.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  resellerID: PropTypes.string,
  order: PropTypes.shape({
    product: PropTypes.object,
    reseller: PropTypes.object,
    askingPrice: PropTypes.string,
    condition: PropTypes.string,
  }).isRequired,
  onRefreshAfterChanges: PropTypes.func,
};

Order.defaultProps = {
  isInEditMode: true,
  order: {
    name: '',
  },
};

export default connect()(Order);
