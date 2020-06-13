import React, { Component } from 'react';
import { MainNavBar, MainFooter } from 'components';

import Style from './style.module.scss';

import { FAQIcon, ContactUsIcon } from 'assets/Icons';

export default class AboutPage extends Component {
  render() {
    return (
      <div
        style={{
          background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
          overflowX: 'hidden',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 style={{ textAlign: 'center' }}>About Us</h1>
            </div>
            <div className={Style.missionContainer}>
              <h2 className={Style.largeFont}>
                Our mission is to provide the best experience for shopping{' '}
                <span style={{ fontWeight: 'bold', color: '#E3E3E3' }}>
                  {' '}
                  authentic streetwear{' '}
                </span>{' '}
                . With us you can buy and sell sneakers and apparel both{' '}
                <span style={{ fontWeight: 'bold', color: '#E3E3E3' }}>
                  {' '}
                  globally{' '}
                </span>{' '}
                and
                <span style={{ fontWeight: 'bold', color: '#E3E3E3' }}>
                  {' '}
                  locally.{' '}
                </span>{' '}
              </h2>
            </div>
            <div className={Style.linksContainer}>
              <a href={'/faqs'} className={Style.link}>
                <FAQIcon />
                <h1 className={Style.linkHeader}>FAQs</h1>
              </a>
              <a href={'/contactUs'} className={Style.link}>
                <ContactUsIcon />
                <h1 className={Style.linkHeader}>Contact Us</h1>
              </a>
            </div>
            <div className={Style.ribbonsContainer}>
              <br />
              <div className={Style.buyerContainer}>
                <h3 className={Style.toContainer}>
                  To <span className={Style.toRibbon}>Buyers</span>
                </h3>
                <h2 className={Style.toDescription}>
                  Shop 100% authentic new and used products globally. Find
                  listings near you on our one-of-a-kind local marketplace.
                </h2>
                <h4
                  style={{
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: '400',
                  }}
                >
                  <a className={Style.learnMore} href="/shop">
                    Shop Now
                  </a>
                </h4>
              </div>
              <br />
              <div className={Style.sellerContainer}>
                <h3 className={Style.toContainer}>
                  To <span className={Style.toRibbon}>Sellers</span>
                </h3>
                <h2 className={Style.toDescription}>
                  Sell both New and Used sneakers and apparel starting at a 5%
                  seller rate.
                </h2>
                <h4
                  style={{
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: '400',
                  }}
                >
                  <a className={Style.learnMore} href="/">
                    Learn More about Selling on Dripverse
                  </a>
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
