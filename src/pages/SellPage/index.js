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
  componentDidMount() {
    console.log(this.props);
    const { showModal } = SellDuck.actionCreators;

    const { user } = this.props;
    if (user) {
      const { resellItems } = user;
      const noOfListings = resellItems.length;
      if (noOfListings === 0) {
        this.props.dispatch(showModal('howSellingWorks'));
      }
    }
  }

  createListing = () => {
    this.props.history.push('/sell/createListing');
  };

  becomeReseller = () => {
    const { user } = this.props;
    const { resellItems } = user;
    if (resellItems && resellItems.length >= 5) {
      this.props.history.push('/resellerSetup');
    }
  };

  renderResellerMessage = () => {
    const { user } = this.props;
    const { resellItems } = user;
    const listingsNeeded = 5 - resellItems.length;
    return resellItems && resellItems.length >= 5 ? (
      <div style={{ color: '#1DB954' }}>
        You are qualified to become a reseller
      </div>
    ) : (
      <div style={{ color: 'red' }}>
        You need {listingsNeeded} more listings to qualify
      </div>
    );
  };

  render() {
    const { user } = this.props;
    if (!user) {
      return null;
    }

    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1>Sell</h1>
              <p className={Style.pageTitleDescription}>
                Anyone can sell on Dripverse. Simply create a listing from
                below. <br /> <br />
                If you are big into reselling, Dripverse let's you create your
                own branded Reseller page. The perfect way to grow your business
                and create a following.
              </p>
            </div>
            <div>
              <div className={Style.contentWrapper}>
                <div>
                  <div
                    className={Style.sellOption}
                    onClick={() => {
                      this.createListing();
                    }}
                  >
                    <PlusIcon />
                  </div>
                  <div style={{ color: 'white' }}>
                    <h4>Create a listing</h4>
                  </div>
                </div>
                <div>
                  <div
                    className={Style.sellOption}
                    onClick={() => {
                      this.becomeReseller();
                    }}
                  >
                    <SneakerIcon />
                  </div>
                  <div>
                    <h4>Become a Reseller</h4>
                    <p>{this.renderResellerMessage()}</p>
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
