import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { EntryPage, LocalListingsPage } from './components';

export default class LocalMarketplace extends Component {
  state = { lat: '', lng: '', address: '' };

  onSelectLocation = (address, lat, lng) => {
    this.setState({ lat, lng, address });
  };

  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          {!this.state.address || !this.state.lat || !this.state.lng ? (
            <EntryPage
              address={this.state.address}
              latitude={this.state.lat}
              longitude={this.state.lng}
              onSelectLocation={this.onSelectLocation}
            />
          ) : (
            <LocalListingsPage
              address={this.state.address}
              latitude={this.state.lat}
              longitude={this.state.lng}
              onSelectLocation={this.onSelectLocation}
            />
          )}
        </div>
      </div>
    );
  }
}
