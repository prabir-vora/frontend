import React, { Component } from 'react';
import { MainNavBar, MainFooter } from 'components';

import Style from './style.module.scss';

export default class AboutPage extends Component {
  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 style={{ textAlign: 'center' }}>About Us</h1>
            </div>
            <div className={Style.missionContainer}>
              <h2
                style={{
                  width: '600px',
                  textAlign: 'center',
                  fontSize: '28px',
                  fontWeight: '400',
                }}
              >
                Our mission is to{' '}
                <span style={{ fontWeight: 'bold', color: '#938cfc' }}>
                  {' '}
                  democratize{' '}
                </span>{' '}
                the buying and selling of sneakers and apparel{' '}
                <span style={{ fontWeight: 'bold', color: '#938cfc' }}>
                  {' '}
                  globally{' '}
                </span>{' '}
                and
                <span style={{ fontWeight: 'bold', color: '#938cfc' }}>
                  {' '}
                  locally.{' '}
                </span>{' '}
              </h2>
              <br />
              <h2
                style={{
                  width: '600px',
                  textAlign: 'center',
                  fontSize: '28px',
                  fontWeight: '400',
                }}
              >
                We are determined to create the{' '}
                <span style={{ fontWeight: 'bold', color: '#938cfc' }}>
                  {' '}
                  cheapest{' '}
                </span>
                way for the buyer and seller interaction to occur, while making
                sure the product is{' '}
                <span style={{ fontWeight: 'bold', color: '#938cfc' }}>
                  authentic.
                </span>
              </h2>
            </div>
            <div className={Style.ribbonsContainer}>
              <div className={Style.sellerContainer}>
                <h3 className={Style.toContainer}>
                  To <span className={Style.toRibbon}>Sellers</span>
                </h3>
                <h2
                  style={{
                    width: '600px',
                    textAlign: 'center',
                    fontSize: '28px',
                    fontWeight: '400',
                  }}
                >
                  We believe it is unfair to have a large 3rd party fees for
                  every resell interaction.
                </h2>
                <h4
                  style={{
                    width: '600px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: '400',
                  }}
                >
                  With our Reseller Program sell for as low as 3%, simply to
                  help us run our platform. Get your own branded page and get
                  discovered on our Resellers page{' '}
                  <a className={Style.learnMore} href="/">
                    Learn More about Selling on Dripverse
                  </a>
                </h4>
              </div>
              <br />
              <div className={Style.buyerContainer}>
                <h3 className={Style.toContainer}>
                  To <span className={Style.toRibbon}>Buyers</span>
                </h3>
                <h2
                  style={{
                    width: '600px',
                    textAlign: 'center',
                    fontSize: '28px',
                    fontWeight: '400',
                  }}
                >
                  Join a community of fashion lovers or hypebeasts. Get products
                  for lower price than other marketplaces simply due to our
                  lower seller fees globally and near you.
                </h2>
                <h4
                  style={{
                    width: '600px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: '400',
                  }}
                >
                  Ordering from a reputed reseller? Skip the authentication
                  process and get it shipped directly. Do not trust the seller,
                  ask for authentication. Find everything from unique and
                  vintage pieces to commoditized products.
                </h4>
              </div>
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}
