import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { PlusIcon, SneakerIcon } from 'assets/Icons';

import { withRouter } from 'react-router-dom';

class SellPage extends Component {
  createListing = () => {
    this.props.history.push('/sell/createListing');
  };

  becomeReseller = () => {
    this.props.history.push('/reseller');
  };

  render() {
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SellPage);
