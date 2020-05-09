import React, { Component } from 'react';

import { Img } from 'fields';

// import {
//   ListingsCountIcon,
//   FollowersCountIcon,
//   DollarIcon,
// } from 'assets/Icons';

import Style from './style.module.scss';

export default class AlgoliaResellerTemplate extends Component {
  render() {
    console.log(this.props);
    const { hit } = this.props;
    const { resellerPageName, resellerBio, username, coverPictureURL } = hit;
    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <div className={Style.gridCell}>
            <a href={`/${username}`}>
              <Img src={coverPictureURL} className={Style.resellerImage} />
            </a>
            <a href={`/${username}`}>
              <div className={Style.resellerInfo}>
                <h2
                  style={{
                    fontSize: '16px',
                    margin: '8px 0px',
                    textAlign: 'center',
                  }}
                >
                  {resellerPageName}
                </h2>
                <h4
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    margin: '8px 0px',
                    textAlign: 'center',
                  }}
                >
                  {resellerBio}
                </h4>
                {/* <div className={Style.resellerStats}>
                <div className={Style.statItem}>
                  <ListingsCountIcon />
                  <div>{listingsCount}</div>
                </div>
                <div className={Style.statItem}>
                  <FollowersCountIcon />
                  <div>100</div>
                </div>
                <div className={Style.statItem}>
                  <DollarIcon />
                  <div>100,000</div>
                </div>
              </div> */}
              </div>
            </a>
            <div className={Style.buttonContainer}>
              <button className={Style.followButton}>Follow</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
