import React, { Component } from 'react';

import Style from './style.module.scss';

import { ListingIcon, ChatIcon, NetworkIcon } from 'assets/Icons';

import { LocationSearchInput } from 'fields';

export default class EntryPage extends Component {
  render() {
    return (
      <div className={Style.pageContainer}>
        <div className={Style.locationContainer}>
          <div className={Style.locationTitle}>
            <div className={Style.text}>
              <span className={Style.nearbyText}>Find Drip near you</span>
            </div>
          </div>
          <div className={Style.locationInput}>
            <LocationSearchInput
              address={this.props.address}
              latitude={this.props.lat}
              longitude={this.props.lng}
              onSelectLocation={this.props.onSelectLocation}
            />
          </div>
          <div className={Style.buttonContainer}>
            <button className={Style.pillButton}>
              <span className={Style.buttonText}>Search</span>
            </button>
          </div>
        </div>
        <div className={Style.featuresContainer}>
          <div className={Style.features}>
            <div className={Style.content}>
              <div className={Style.individualFeature}>
                <div className={Style.featureIcon}>
                  <ListingIcon />
                </div>
                <div className={Style.descriptionContainer}>
                  <h2>Browse Listings nearby</h2>
                </div>
              </div>
              <div className={Style.individualFeature}>
                <div className={Style.featureIcon}>
                  <ChatIcon />
                </div>
                <div className={Style.descriptionContainer}>
                  <h2>Message Reseller</h2>
                </div>
              </div>
              <div className={Style.individualFeature}>
                <div className={Style.featureIcon}>
                  <NetworkIcon />
                </div>
                <div className={Style.descriptionContainer}>
                  <h2>Meetup to buy/trade</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
