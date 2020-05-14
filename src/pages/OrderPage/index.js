import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavBar, MainFooter, LoadingScreen } from 'components';

import CheckoutDuck from 'stores/ducks/Checkout.duck';
import UserDuck from 'stores/ducks/User.duck';

import { withCookies } from 'react-cookie';

import { withRouter } from 'react-router-dom';

import Style from './style.module.scss';
import { Img } from 'fields';

import { NewAddressInput, NewPaymentInput, ReviewOrder } from './components';

class OrderPage extends Component {
  state = {
    isUserPresent: false,
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

  fetchCurrentOrder = async orderNumber => {
    // const { checkout } = this.props;

    // const { ordersMap } = checkout;

    // const { orderNumber } = this.props.match.params;

    const { fetchOrder } = CheckoutDuck.actionCreators;
    const { success, message } = await this.props.dispatch(
      fetchOrder(orderNumber),
    );
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

    return response;
  };

  createNewPaymentMethod = async paymentMethodID => {
    const { orderNumber } = this.props.match.params;

    const { createPaymentMethod } = CheckoutDuck.actionCreators;

    const response = await this.props.dispatch(
      createPaymentMethod(orderNumber, paymentMethodID),
    );

    return response;
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
      <div className={Style.contentContainer}>
        <div className={Style.imageContainer}>
          <Img src={original_image_url} className={Style.productImage} />
          <div className={Style.productDetails}>
            <h1 style={{ marginTop: '50px', textAlign: 'center' }}>{name}</h1>
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
          </div>
        </div>
      </div>
    );
  };

  renderCheckoutContainer = data => {
    const { buyerAddress, billingInfo } = data;

    if (!buyerAddress) {
      return (
        <NewAddressInput
          user={this.props.user}
          createNewAddress={this.createNewAddress}
        />
      );
    } else if (!billingInfo) {
      return (
        <NewPaymentInput
          newSetupIntent={this.newSetupIntent}
          addNewPaymentMethod={this.createNewPaymentMethod}
        />
      );
    } else {
      return <ReviewOrder />;
    }
  };

  render() {
    const { orderNumber } = this.props.match.params;
    const { user, checkout } = this.props;

    const { isSaving, ordersMap } = checkout;

    const data = ordersMap[orderNumber];

    if ((this.state.isUserPresent && !user) || isSaving || !data) {
      return <LoadingScreen />;
    }

    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div style={{ display: 'flex', width: '100%' }}>
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

const x = withCookies(OrderPage);
const y = withRouter(x);

export default connect(mapStateToProps)(y);
