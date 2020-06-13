import React, { Component } from 'react';

import Style from './style.module.scss';
import cx from 'classnames';

import { connect } from 'react-redux';

import OrdersDuck from 'stores/ducks/Orders.duck';
import UserDuck from 'stores/ducks/User.duck';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';
import moment from 'moment';
import { Img } from 'fields';

import Switch from 'react-switch';

class Orders extends Component {
  componentDidMount() {
    const { actionCreators } = OrdersDuck;
    const { fetchBuyOrders, fetchSellOrders } = actionCreators;
    this.props.dispatch(fetchBuyOrders());
    this.props.dispatch(fetchSellOrders());
  }

  toggleSelection = selection => {
    const { data } = this.props;
    const { orderSelection } = data;
    const { actionCreators } = OrdersDuck;
    const { toggleOrdersView } = actionCreators;

    if (orderSelection !== selection) {
      this.props.dispatch(toggleOrdersView(selection));
    }
  };

  // onOrderClick = orderID => {
  //   const { actionCreators } = OrdersDuck;
  //   const { onClickOrder } = actionCreators;

  //   const { data } = this.props;
  //   const { orderSelection } = data;
  //   console.log(orderSelection);

  //   this.props.dispatch(onClickOrder(orderID, orderSelection));
  // };

  onMarkAsRead = async orderNumber => {
    const { actionCreators } = OrdersDuck;
    const { markAsRead } = actionCreators;

    const { data } = this.props;
    const { orderSelection } = data;
    console.log(orderSelection);

    const { success } = await this.props.dispatch(
      markAsRead(orderNumber, orderSelection),
    );

    console.log(success);
    const { fetchNotifCount } = UserDuck.actionCreators;

    if (success) {
      await this.props.dispatch(fetchNotifCount());
    }
  };

  renderOrders = () => {
    const { data } = this.props;
    const { orderSelection } = data;

    return (
      <div>
        {orderSelection === 'buying'
          ? this.renderBuyOrders()
          : this.renderSellOrders()}
      </div>
    );
  };

  renderBuyOrders = () => {
    const { data } = this.props;
    const { buying } = data;
    const { orders, loadingOrders } = buying;

    if (loadingOrders) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <ClipLoader color={'#ffffff'} />
        </div>
      );
    }

    return (
      <InfiniteScroll dataLength={orders.length}>
        {orders.length === 0 && (
          <div className={Style.noMessages}>No Results</div>
        )}
        <div className={Style.listView}>
          {orders.map(order => {
            console.log(orders);
            const { id } = order;
            return this.renderBuyOrderItem(order);
          })}
        </div>
      </InfiniteScroll>
    );
  };

  renderSellOrders = () => {
    const { data } = this.props;
    const { selling } = data;
    const { orders, loadingOrders } = selling;

    if (loadingOrders) {
      return (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '20px',
          }}
        >
          <ClipLoader color={'#ffffff'} />
        </div>
      );
    }

    return (
      <InfiniteScroll dataLength={orders.length}>
        {orders.length === 0 && (
          <div className={Style.noMessages}>No Results</div>
        )}
        <div className={Style.listView}>
          {orders.map(order => {
            console.log(orders);
            const { id } = order;
            return this.renderSellOrderItem(order);
          })}
        </div>
      </InfiniteScroll>
    );
  };

  renderBuyOrderItem = order => {
    const {
      id,
      status,
      resellItem,
      orderNumber,
      price_cents,
      buyerRead,
      purchased_at,
    } = order;

    console.log(order);

    const { product } = resellItem;
    const { original_image_url, name, slug } = product;

    return (
      <a style={{ width: '100%' }} href={`/orders/${orderNumber}`}>
        <div
          key={id}
          className={Style.orderItem}
          onClick={() => {
            // this.onOrderClick(id);

            if (!buyerRead) {
              this.onMarkAsRead(orderNumber);
            }
          }}
        >
          <div>
            <Img src={original_image_url} className={Style.productImage} />
          </div>

          <div className={Style.orderDetailsContainer}>
            <div className={Style.orderDetails}>
              <div className={Style.productName}>
                <h4>{name}</h4>
              </div>
              <div>
                <div className={Style.orderDetailLabel}>
                  Order Number: {orderNumber}
                </div>
                <div className={Style.orderDetailLabel}>
                  Purchased On: {moment(purchased_at).format('MM-DD-YYYY')}
                </div>
                <div className={Style.orderDetailLabel}>
                  Price: ${price_cents / 100}
                </div>
              </div>
            </div>

            <div
              className={Style.statusContainer}
              style={{ marginLeft: 'auto' }}
            >
              <div className={Style.orderStatus}>
                {this.renderBuyStatus(status)}
              </div>
            </div>
          </div>
          {!buyerRead && <div className={Style.unreadAlert} />}
        </div>
      </a>
    );
  };

  renderActiveBuyOrderItem = order => {
    const {
      id,
      status,
      resellItem,
      orderNumber,
      price_cents,
      shipping_cents,
      total_price_cents,
      purchased_at,
    } = order;

    console.log(order);

    const { product } = resellItem;
    const { original_image_url, name, slug } = product;

    return (
      <div
        key={id}
        className={Style.orderItemActive}
        // onClick={() => this.onOrderClick(id)}
      >
        <div style={{ width: '100%', display: 'flex' }}>
          <div
            style={{
              marginRight: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Img
              src={original_image_url}
              style={{ width: '120px', height: '120px' }}
            />
            <div style={{ maxWidth: 'fit-content' }}>{name}</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '40px',
              marginLeft: 'auto',
              justifyContent: 'center',
            }}
          >
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Order Number: {orderNumber}
            </h4>
          </div>
        </div>
        <div className={Style.orderDetails}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '0px 40px',
            }}
          >
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Purchased On: {moment(purchased_at).format('MM-DD-YYYY')}
            </h4>
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Price: ${price_cents / 100}
            </h4>
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Shipping: ${shipping_cents / 100}
            </h4>
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Order Total: ${total_price_cents / 100}
            </h4>
          </div>
          <div>
            <h3>Status: {this.renderBuyStatus(status)}</h3>
          </div>
        </div>
      </div>
    );
  };

  renderSellOrderItem = order => {
    const {
      id,
      status,
      resellItem,
      orderNumber,
      price_cents,
      sellerRead,
      purchased_at,
    } = order;

    console.log(order);

    const { product } = resellItem;
    const { original_image_url, name, slug } = product;

    return (
      <a style={{ width: '100%' }} href={`/sellOrders/${orderNumber}`}>
        <div
          key={id}
          className={Style.orderItem}
          onClick={() => {
            // this.onOrderClick(id);
            if (!sellerRead) {
              this.onMarkAsRead(orderNumber);
            }
          }}
        >
          <div>
            <Img src={original_image_url} className={Style.productImage} />
          </div>

          <div className={Style.orderDetailsContainer}>
            <div className={Style.orderDetails}>
              <div className={Style.productName}>
                <h4>{name}</h4>
              </div>
              <div>
                <div className={Style.orderDetailLabel}>
                  Order Number: {orderNumber}
                </div>
                <div className={Style.orderDetailLabel}>
                  Purchased On: {moment(purchased_at).format('MM-DD-YYYY')}
                </div>
                <div className={Style.orderDetailLabel}>
                  Price: ${price_cents / 100}
                </div>
              </div>
            </div>
            <div
              className={Style.statusContainer}
              style={{ marginLeft: 'auto' }}
            >
              <div className={Style.orderStatus}>
                {this.renderSellStatus(status)}
              </div>
            </div>
          </div>

          {!sellerRead && <div className={Style.unreadAlert} />}
        </div>
      </a>
    );
  };

  renderActiveSellOrderItem = order => {
    const {
      id,
      status,
      resellItem,
      orderNumber,
      price_cents,
      seller_shipping_cents,
      seller_amount_made_cents,
      platform_fees_seller_cents,
      purchased_at,
    } = order;

    console.log(order);

    const { product } = resellItem;
    const { original_image_url, name, slug } = product;

    return (
      <div
        key={id}
        className={Style.orderItemActive}
        // onClick={() => this.onOrderClick(id)}
      >
        <div style={{ width: '100%', display: 'flex' }}>
          <div
            style={{
              marginRight: '40px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Img
              src={original_image_url}
              style={{ width: '120px', height: '120px' }}
            />
            <div style={{ maxWidth: 'fit-content' }}>{name}</div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '40px',
              marginLeft: 'auto',
              justifyContent: 'center',
            }}
          >
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Order Number: {orderNumber}
            </h4>
          </div>
        </div>
        <div className={Style.orderDetails}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '0px 40px',
            }}
          >
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Purchased On: {moment(purchased_at).format('MM-DD-YYYY')}
            </h4>
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Price: ${price_cents / 100}
            </h4>
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Shipping + Platform Fees: - $
              {(seller_shipping_cents + platform_fees_seller_cents) / 100}
            </h4>
            <h4 style={{ margin: '10px 0', fontWeight: '400' }}>
              Amount made: ${seller_amount_made_cents / 100}
            </h4>
          </div>
          <div>
            <h3>Status: {this.renderSellStatus(status)}</h3>
          </div>
        </div>
      </div>
    );
  };

  renderBuyStatus = status => {
    switch (status) {
      case 'SELLER_PENDING':
        return 'Awaiting Seller confirmation.';
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
        return;
    }
  };

  renderSellStatus = status => {
    switch (status) {
      case 'SELLER_PENDING':
        return 'Awaiting your confirmation';
      case 'SELLER_CONFIRMED':
        return 'You have confirmed the order request';
      case 'SELLER_CANCELLED':
        return 'You have denied the order request. Lost 10 points';
      case 'SHIPPED_FOR_AUTHENTICATION':
        return 'Item shipped for authentication';
      case 'AUTHENTICATION_SUCCESSFUL':
        return 'Your item has been successfuly authenticated';
      case 'AUTHENTICATION_FAILED':
        return 'Your item failed authentication';
      case 'SHIPPED_TO_USER':
        return 'Item has been Shipped to buyer';
      case 'SHIPMENT_ISSUE':
        return 'Order has undergone a shipment issue';
      case 'UNDER_REVIEW':
        return 'Due to some problem, the order is under review';
      case 'REFUNDED':
        return 'The transaction has been reversed';
      case 'COMPLETE':
        return 'Complete';
      default:
        return;
    }
  };

  render() {
    console.log(this.props);
    const { data } = this.props;
    const { orderSelection } = data;

    return (
      <div className={Style.ordersContainer}>
        <div className={Style.mobileTitle}>Orders</div>
        <div style={{ width: '80%' }}>
          {/* <div className={Style.orderSelectionContainer}>
            <span
              className={
                orderSelection === 'buying'
                  ? cx(Style.selectionButton, Style.activeSelection)
                  : Style.selectionButton
              }
              onClick={() => this.toggleSelection('buying')}
            >
              BUY ORDERS
            </span>
            <span className={Style.seperator}></span>
            <span
              className={
                orderSelection === 'selling'
                  ? cx(Style.selectionButton, Style.activeSelection)
                  : Style.selectionButton
              }
              onClick={() => this.toggleSelection('selling')}
            >
              SELL ORDERS
            </span>
          </div> */}
          <div className={Style.orderSelectionContainer}>
            <label
              className={Style.orderSelectionLabel}
              onClick={() => this.toggleSelection('buying')}
            >
              Buy Orders
            </label>
            <Switch
              checked={orderSelection === 'selling' ? true : false}
              onChange={value => {
                if (value !== true) {
                  this.toggleSelection('buying');
                } else {
                  this.toggleSelection('selling');
                }
              }}
              onColor="#9A8686"
              onHandleColor="#fff"
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
              activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
              height={20}
              width={48}
              className="react-switch"
              id="material-switch"
            />
            <label
              className={Style.orderSelectionLabel}
              onClick={() => this.toggleSelection('selling')}
            >
              Sell Orders
            </label>
          </div>
          <div>{this.renderOrders()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state[OrdersDuck.duckName],
  };
};

export default connect(mapStateToProps)(Orders);
