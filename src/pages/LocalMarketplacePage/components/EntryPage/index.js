import React, { Component } from 'react';

import Style from './style.module.scss';

import { ListingIcon, ChatIcon, NetworkIcon } from 'assets/Icons';

import { LocationSearchInput } from 'fields';

export default class EntryPage extends Component {
  state = {
    lat: '',
    lng: '',
    address: '',
  };

  onSelectLocation = (address, lat, lng) => {
    this.setState({ lat, lng, address });
  };

  onSearch = () => {
    const { lat, lng, address } = this.state;
    this.props.onSelectLocation(address, lat, lng);
  };

  render() {
    return (
      <div className={Style.pageContainer}>
        <div className={Style.locationContainer}>
          <div className={Style.locationTitle}>
            <h4 className={Style.subtitle}>Find Drip near you</h4>
          </div>
          <div className={Style.locationInput}>
            <LocationSearchInput
              address={this.address}
              latitude={this.lat}
              longitude={this.lng}
              onSelectLocation={this.onSelectLocation}
            />
          </div>
          <div className={Style.buttonContainer}>
            <button
              className={Style.pillButton}
              onClick={() => this.onSearch()}
            >
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
