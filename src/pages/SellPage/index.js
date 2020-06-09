import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { PlusIcon, SneakerIcon } from 'assets/Icons';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';
import SellDuck from 'stores/ducks/Sell.duck';

import MainFooter from 'components/MainFooter';

class SellPage extends Component {
  createListing = () => {
    const { showModal } = SellDuck.actionCreators;

    const { user } = this.props;
    const { stripe_connect_account_status, activeSellerAddressID } = user;

    if (
      stripe_connect_account_status !== 'active' ||
      activeSellerAddressID === ''
    ) {
      return this.props.dispatch(showModal('sellerSetup'));
    }

    this.props.history.push('/sell/createListing');
  };

  // becomeReseller = () => {
  //   const { user } = this.props;
  //   const { resellItems } = user;
  //   if (resellItems && resellItems.length >= 5) {
  //     this.props.history.push('/resellerSetup');
  //   }
  // };

  // renderResellerMessage = () => {
  //   const { user } = this.props;
  //   const { resellItems } = user;
  //   const listingsNeeded = 5 - resellItems.length;
  //   return resellItems && resellItems.length >= 5 ? (
  //     <div style={{ color: '#1DB954' }}>
  //       You are qualified to become a reseller
  //     </div>
  //   ) : (
  //     <div style={{ color: 'red' }}>
  //       You need {listingsNeeded} more listings to qualify
  //     </div>
  //   );
  // };

  render() {
    const { user } = this.props;
    if (!user) {
      return null;
    }

    return (
      <div
        style={{
          background: 'linear-gradient(#888380 0%, #2B2928 99%)',
          overflowX: 'hidden',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 className={Style.titleLarge}> Sell</h1>
              <p className={Style.subtitle}>
                Anyone can sell on Dripverse. Simply create a listing from
                below. Sell both Globally and Locally.
              </p>
            </div>
            <div>
              <div className={Style.contentWrapper}>
                <div className={Style.sellOptionContainer}>
                  <div
                    className={Style.sellOption}
                    onClick={() => {
                      this.createListing();
                    }}
                  >
                    <PlusIcon />
                  </div>
                  <div style={{ color: 'white' }}>
                    <h4 className={Style.title}>Create a listing</h4>
                  </div>
                </div>
                <div>
                  <div
                    className={Style.sellOption}
                    onClick={() => {
                      const { showModal } = SellDuck.actionCreators;
                      this.props.dispatch(showModal('howSellingWorks'));
                    }}
                  >
                    <SneakerIcon />
                  </div>
                  <div>
                    <h4 className={Style.title}>How Selling Works</h4>
                    {/* <p>{this.renderResellerMessage()}</p> */}
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
  };
};

const x = withRouter(SellPage);

export default connect(mapStateToProps)(x);
