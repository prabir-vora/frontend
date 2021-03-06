import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavBar, MainFooter, LoadingScreen } from 'components';

import CheckoutDuck from 'stores/ducks/Checkout.duck';
import UserDuck from 'stores/ducks/User.duck';

import { withCookies } from 'react-cookie';

import { withRouter } from 'react-router-dom';

import Style from './style.module.scss';
import { Img } from 'fields';

import {
  NewAddressInput,
  NewPaymentInput,
  ReviewOrder,
  ItemPurchased,
} from './components';

import { ElementsConsumer } from '@stripe/react-stripe-js';

class OrderPage extends Component {
  state = {
    isUserPresent: false,
    addNewAddress: false,
    addNewPayment: false,
    orderPurchased: false,
    errorMessage: '',
  };

  async componentDidMount() {
    const { orderNumber } = this.props.match.params;

    if (!orderNumber) {
      this.props.history.push('/');
    }

    const jwt = this.props.cookies.get('jwt');
    if (jwt) {
      this.setState({ isUserPresent: true });
    } else {
      this.props.history.push('/');
    }

    // if (this.props.user) {
    //   this.fetchCurrentOrder(orderNumber);
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    const { orderNumber } = this.props.match.params;

    const jwt = this.props.cookies.get('jwt');
    if (jwt && !prevState.isUserPresent) {
      this.setState({ isUserPresent: true });
    }

    if (!jwt && prevState.isUserPresent) {
      this.setState({ isUserPresent: false });
    }

    if (prevProps.user !== this.props.user) {
      this.fetchCurrentOrder(orderNumber);
    }
  }

  onAddNewAddress = () => {
    this.setState({
      addNewAddress: true,
    });
  };

  onAddNewPayment = () => {
    this.setState({
      addNewPayment: true,
    });
  };

  fetchCurrentOrder = async orderNumber => {
    // const { checkout } = this.props;

    // const { ordersMap } = checkout;

    // const { orderNumber } = this.props.match.params;

    const { fetchOrder } = CheckoutDuck.actionCreators;
    const { success, message } = await this.props.dispatch(
      fetchOrder(orderNumber),
    );

    if (!success) {
      this.setState({
        errorMessage: message,
      });
    }
  };

  newSetupIntent = async () => {
    const { fetchNewSetupIntent } = CheckoutDuck.actionCreators;
    return await this.props.dispatch(fetchNewSetupIntent());
  };

  createNewAddress = async address => {
    const { orderNumber } = this.props.match.params;

    const { createShippingAddress } = CheckoutDuck.actionCreators;
    const response = await this.props.dispatch(
      createShippingAddress(orderNumber, address),
    );

    const { fetchUpdatedUser } = UserDuck.actionCreators;

    if (response.updated) {
      this.props.dispatch(fetchUpdatedUser());
      this.setState({ addNewAddress: false });
    }

    return response;
  };

  createNewPaymentMethod = async paymentMethodID => {
    const { orderNumber } = this.props.match.params;

    const { createPaymentMethod } = CheckoutDuck.actionCreators;

    const response = await this.props.dispatch(
      createPaymentMethod(orderNumber, paymentMethodID),
    );

    const { fetchUpdatedUser } = UserDuck.actionCreators;

    if (response.updated) {
      this.props.dispatch(fetchUpdatedUser());
    }

    return response;
  };

  goBack = () => {
    this.setState({
      addNewAddress: false,
      addNewPayment: false,
    });
  };

  updateShippingAddress = async addressID => {
    const { orderNumber } = this.props.match.params;

    const { updateShippingAddress } = CheckoutDuck.actionCreators;

    const response = await this.props.dispatch(
      updateShippingAddress(orderNumber, addressID),
    );

    console.log(response);

    return response;
  };

  updatePaymentMethod = async paymentID => {
    const { orderNumber } = this.props.match.params;

    const { updatePaymentMethod } = CheckoutDuck.actionCreators;

    const response = await this.props.dispatch(
      updatePaymentMethod(orderNumber, paymentID),
    );

    console.log(response);

    return response;
  };

  onPurchaseOrder = async () => {
    const { orderNumber } = this.props.match.params;

    const { purchaseOrder } = CheckoutDuck.actionCreators;

    const paymentIntentClientSecret = await this.props.dispatch(
      purchaseOrder(orderNumber),
    );

    if (paymentIntentClientSecret === '') {
      return { success: false };
    }

    const { stripe } = this.props;

    const result = await stripe.confirmCardPayment(paymentIntentClientSecret);

    console.log(result);
    const { paymentIntent } = result;

    if (paymentIntent.status === 'succeeded') {
      console.log('Calling Payment Success');
      const { onPaymentSuccess } = CheckoutDuck.actionCreators;
      this.props.dispatch(onPaymentSuccess(orderNumber));

      this.setState({
        orderPurchased: true,
      });

      return { success: true };
    }

    return { success: false };
  };

  renderResellItem = data => {
    console.log(data);
    const { resellItem } = data;
    const { product, condition, size, reseller, askingPrice } = resellItem;
    const { name, original_image_url } = product;
    const { username } = reseller;

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <React.Fragment>
        <div className={Style.productNameMobile}>{resellItem.product.name}</div>
        <div className={Style.contentContainer}>
          <div className={Style.detailsContainer}>
            <div className={Style.detailsBlock}>
              <div className={Style.detailsTitle}>Size</div>
              <div className={Style.detailsContent}>{size}</div>
            </div>
            <div className={Style.detailsBlock}>
              <div className={Style.detailsTitle}>Price</div>
              <div className={Style.detailsContent}>${askingPrice}</div>
            </div>
            <div className={Style.detailsBlock}>
              <div className={Style.detailsTitle}>Condition</div>
              <div className={Style.detailsContent}>
                {conditionMap[condition].label}
              </div>
            </div>
          </div>

          <div className={Style.imageContainer}>
            <Img src={original_image_url} className={Style.productImage} />
          </div>
        </div>
      </React.Fragment>
    );
  };

  renderOrderProgression = data => {
    const { addNewAddress, addNewPayment, orderPurchased } = this.state;
    const { buyerAddress, billingInfo, purchased_at } = data;

    console.log(this.state);
    if (orderPurchased || purchased_at) {
      return null;
    }

    return (
      <div className={Style.orderProgressContainer}>
        <div className={Style.orderProgress}>
          <div style={{ position: 'relative' }}>
            <div className={Style.individualOrderProgress}>
              {!buyerAddress || addNewAddress ? (
                <span className={Style.activeBullet}>
                  <span className={Style.insideBullet} />
                </span>
              ) : (
                <span className={Style.bullet} />
              )}
            </div>
            <h4 className={Style.orderProgressLabel}>SHIPPING</h4>
          </div>

          <hr className={Style.seperator} />

          <div style={{ position: 'relative' }}>
            <div className={Style.individualOrderProgress}>
              {(!billingInfo || addNewPayment) &&
              buyerAddress &&
              !addNewAddress ? (
                <span className={Style.activeBullet}>
                  <span className={Style.insideBullet} />
                </span>
              ) : (
                <span className={Style.bullet} />
              )}
            </div>
            <h4 className={Style.orderProgressLabel}>PAYMENT</h4>
          </div>

          <hr className={Style.seperator} />

          <div style={{ position: 'relative' }}>
            <div className={Style.individualOrderProgress}>
              {buyerAddress &&
              !addNewAddress &&
              billingInfo &&
              !addNewPayment ? (
                <span className={Style.activeBullet}>
                  <span className={Style.insideBullet} />
                </span>
              ) : (
                <span className={Style.bullet} />
              )}
            </div>
            <h4 className={Style.orderProgressLabel}>CONFIRMATION</h4>
          </div>
        </div>
      </div>
    );
  };

  renderCheckoutContainer = data => {
    const { addNewAddress, addNewPayment, orderPurchased } = this.state;
    const { buyerAddress, billingInfo, purchased_at, status } = data;

    if (orderPurchased || purchased_at || status !== 'BUYER_PENDING') {
      return (
        <ItemPurchased
          orderDetails={data}
          user={this.props.user}
          purchased_at={purchased_at}
          status={status}
        />
      );
    }

    if (!buyerAddress || addNewAddress) {
      return (
        <NewAddressInput
          user={this.props.user}
          createNewAddress={this.createNewAddress}
          addNewAddress={addNewAddress}
          goBack={this.goBack}
        />
      );
    } else if (!billingInfo || addNewPayment) {
      return (
        <NewPaymentInput
          newSetupIntent={this.newSetupIntent}
          addNewPaymentMethod={this.createNewPaymentMethod}
          addNewPayment={addNewPayment}
          goBack={this.goBack}
        />
      );
    } else {
      return (
        <ReviewOrder
          orderDetails={data}
          user={this.props.user}
          onAddNewAddress={this.onAddNewAddress}
          onAddNewPayment={this.onAddNewPayment}
          updateShippingAddress={this.updateShippingAddress}
          updatePaymentMethod={this.updatePaymentMethod}
          onPurchaseOrder={this.onPurchaseOrder}
        />
      );
    }
  };

  render() {
    console.log(this.props);
    const { orderNumber } = this.props.match.params;
    const { user, checkout } = this.props;

    const { isSaving, ordersMap, error } = checkout;

    const data = ordersMap[orderNumber];

    if ((this.state.isUserPresent && !user) || isSaving || (!data && !error)) {
      return <LoadingScreen />;
    }

    console.log(error);

    if (error) {
      return (
        <div
          style={{
            background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
          }}
        >
          <MainNavBar />
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              minHeight: '100vh',
              padding: '5% 0',
              height: '100%',
            }}
          >
            <h1 className={Style.noResultsTitle}>Sorry, {error}</h1>
            <a style={{ textDecoration: 'underline' }} href="/shop">
              Go to shop
            </a>
          </div>

          <MainFooter />
        </div>
      );
    }

    const { resellItem } = data;

    return (
      <div
        style={{
          background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
          minHeight: '100vh',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          {this.renderOrderProgression(data)}
          <div className={Style.productNameLarge}>
            {resellItem.product.name}
          </div>
          <div className={Style.checkoutLayout}>
            <div className={Style.resellItemContainer}>
              {this.renderResellItem(data)}
            </div>
            <div className={Style.checkoutContainer}>
              {this.renderCheckoutContainer(data)}
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
    checkout: state[CheckoutDuck.duckName],
  };
};

const OrdersContainer = props => {
  return (
    <ElementsConsumer>
      {({ elements, stripe }) => (
        <OrderPage elements={elements} stripe={stripe} {...props} />
      )}
    </ElementsConsumer>
  );
};

const x = withCookies(OrdersContainer);
const y = withRouter(x);

export default connect(mapStateToProps)(y);
