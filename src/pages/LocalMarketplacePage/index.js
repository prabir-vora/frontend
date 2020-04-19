import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { EntryPage, LocalListingsPage } from './components';

class LocalMarketplace extends Component {
  state = { lat: '', lng: '', address: '' };

  componentDidMount() {
    const { user } = this.props;
    if (user) {
      const { address, _geoloc } = user;
      const { lat, lng } = _geoloc;
      this.setState({ address, lat, lng });
    }
  }

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

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
  };
};

export default connect(mapStateToProps)(LocalMarketplace);
