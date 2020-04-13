import React, { Component } from 'react';

import { Img } from 'fields';

import {
  ListingsCountIcon,
  FollowersCountIcon,
  DollarIcon,
} from 'assets/Icons';

import Style from './style.module.scss';

export default class AlgoliaResellerTemplate extends Component {
  render() {
    console.log(this.props);
    const { hit } = this.props;
    const {
      resellerPageName,
      resellerBio,
      listingsCount,
      username,
      coverPictureURL,
    } = hit;
    return (
      <div className={Style.resellerContainer}>
        <a href={`/user/${username}`}>
          <Img src={coverPictureURL} className={Style.resellerImage} />
        </a>
        <div className={Style.resellerInfo}>
          <h2 style={{ fontSize: '20px', margin: '10px 0px' }}>
            {resellerPageName}
          </h2>
          <h4 style={{ fontWeight: '500', margin: '20px 0px' }}>
            {resellerBio}
          </h4>
          <div className={Style.resellerStats}>
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
          </div>
        </div>
        <div className={Style.buttonContainer}>
          <button className={Style.followButton}>Follow</button>
        </div>
      </div>
    );
  }
}
