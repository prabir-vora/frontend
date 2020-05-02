import React, { Component } from 'react';

import { MainNavBar, MainFooter } from 'components';

import Style from './style.module.scss';
import { TickIcon, CrossIcon } from 'assets/Icons';

export default class PhotoGuidelinesPage extends Component {
  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 className={Style.ribbon}>Photo Guidelines</h1>
            </div>
            <div className={Style.bodyContainer}>
              <h2
                style={{
                  width: '600px',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: '400',
                }}
              >
                We require clear photos that follow our photo guidelines. The
                photos you upload must be of the items in your possession that
                you intend to sell and ship. Any issues such as damage,
                discoloration, or flaws should be clearly photographed.
              </h2>
            </div>
            <div className={Style.dosAndDontsContainer}>
              <div className={Style.dosContainer}>
                <TickIcon />
                <ul className={Style.dosList}>
                  <li className={Style.dosListItem}>
                    Both sneakers shown in a full, clear view.
                  </li>
                  <li className={Style.dosListItem}>
                    Both sneakers are fully visible within the frame of the
                    photo.
                  </li>
                  <li className={Style.dosListItem}>Clear Background</li>
                </ul>
              </div>
              <div className={Style.dontsContainer}>
                <CrossIcon />
                <ul className={Style.dosList}>
                  <li className={Style.dosListItem}>
                    Bad lighting. We recommend taking photos in bright lighting
                    conditions, such as under direct sunlight.
                  </li>
                  <li className={Style.dosListItem}>
                    Non-sneaker photos. Make sure no other objects or
                    distracting patterns or items are in the photo with the
                    shoes.
                  </li>
                  <li className={Style.dosListItem}>
                    Personal information shown in photos.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}
