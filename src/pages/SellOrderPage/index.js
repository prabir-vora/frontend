import React, { Component } from 'react';
import { connect } from 'react-redux';
import { MainNavBar, MainFooter, LoadingScreen } from 'components';

import CheckoutDuck from 'stores/ducks/Checkout.duck';
import UserDuck from 'stores/ducks/User.duck';

import { withCookies } from 'react-cookie';

import { withRouter } from 'react-router-dom';

import Style from './style.module.scss';
import { Img } from 'fields';

import moment from 'moment';
class SellOrderPage extends Component {
  state = {
    isUserPresent: false,
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
      this.fetchSellerOrder(orderNumber);
    }
  }

  fetchSellerOrder = async orderNumber => {
    // const { checkout } = this.props;

    // const { ordersMap } = checkout;

    // const { orderNumber } = this.props.match.params;

    const { fetchSellerOrder } = CheckoutDuck.actionCreators;
    const { success, message } = await this.props.dispatch(
      fetchSellerOrder(orderNumber),
    );

    if (!success) {
      this.setState({
        errorMessage: message,
      });
    }
  };

  renderStatusText = status => {
    switch (status) {
      case 'SELLER_PENDING':
        return 'Awaiting your confirmation';
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
        return 'Order has been accepted.';
    }
  };

  renderResellItem = data => {
    console.log(data);
    const { resellItem } = data;
    const { product, condition, size, askingPrice } = resellItem;
    const { name, original_image_url } = product;

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

  renderOrderDetails = data => {
    const {
      sellerAddress,
      price_cents,
      seller_amount_made_cents,
      seller_shipping_cents,
      platform_fees_seller_cents,
      applicationFeeRateCharged,
      sellerScoreDuringPurchase,
      total_price_cents,
    } = data;

    const {
      address1,
      address2,
      city_locality,
      country_code,
      phone,
      postal_code,
      state_province,
    } = sellerAddress;

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
            <h3 className={Style.OrderReviewSummaryDetailTitle}>Ship From</h3>
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
            <h3 className={Style.OrderReviewSummaryDetailTitle}>
              Fee rate Charged
            </h3>
          </div>

          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {applicationFeeRateCharged}%
              </div>
            </div>
          </div>
        </div>

        <div className={Style.OrderReviewSummaryDetail}>
          <div className={Style.OrderReviewTitleContainer}>
            <h3 className={Style.OrderReviewSummaryDetailTitle}>Summary</h3>
          </div>
          <div className={Style.OrderReviewSummaryDetailContent}>
            <div className={Style.OrderReviewSummaryDetailContentItem}>
              <div style={{ minWidth: '200px' }}>
                <div className={Style.priceSummary}>
                  <div>Listing Price</div>
                  <div>${price_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div>Shipping</div>
                  <div>- ${seller_shipping_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div>Platform Fee</div>
                  <div>- ${platform_fees_seller_cents / 100}</div>
                </div>
                <div className={Style.priceSummary}>
                  <div>Amount Made</div>
                  <div>${seller_amount_made_cents / 100}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { orderNumber } = this.props.match.params;
    const { user, checkout } = this.props;

    const { isSavingSellerOrder, sellerOrdersMap, error } = checkout;

    const data = sellerOrdersMap[orderNumber];

    if (
      (this.state.isUserPresent && !user) ||
      isSavingSellerOrder ||
      (!data && !error)
    ) {
      return <LoadingScreen />;
    }

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
          </div>

          <MainFooter />
        </div>
      );
    }

    const { resellItem, status } = data;

    return (
      <div
        style={{
          background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
          minHeight: '100vh',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.productNameLarge}>
            {resellItem.product.name}
          </div>
          <div className={Style.checkoutLayout}>
            <div className={Style.resellItemContainer}>
              {this.renderResellItem(data)}
            </div>
            <div className={Style.checkoutContainer}>
              <div className={Style.formContainer}>
                <h1 className={Style.title}>SUMMARY</h1>
                <div className={Style.form}>
                  <br />
                  {this.renderOrderDetails(data)}
                  <br />
                  <div className={Style.orderStatus}>
                    {this.renderStatusText(status)}
                  </div>
                </div>
              </div>
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

const x = withCookies(SellOrderPage);
const y = withRouter(x);

export default connect(mapStateToProps)(y);
