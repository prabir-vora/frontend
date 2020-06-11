import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import { EntryPage, LocalListingsPage } from './components';
import MainFooter from 'components/MainFooter';
import LoadingScreen from 'components/LoadingScreen';

import { withCookies } from 'react-cookie';

class LocalMarketplace extends Component {
  state = {
    lat: '',
    lng: '',
    address: '',
    isUserPresent: false,
  };

  componentDidMount() {
    const jwt = this.props.cookies.get('jwt');

    const { user } = this.props;
    if (user && user._geoloc && user.address) {
      const { address, _geoloc } = user;
      const { lat, lng } = _geoloc;
      this.setState({
        address,
        lat,
        lng,
        isUserPresent: jwt !== null && jwt !== undefined,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user !== this.props.user) {
      const { user } = this.props;
      if (user && user._geoloc && user.address) {
        const { address, _geoloc } = user;
        const { lat, lng } = _geoloc;
        this.setState({ address, lat, lng });
      } else {
        this.setState({ lat: '', lng: '', address: '' });
      }
    }

    const jwt = this.props.cookies.get('jwt');
    if (jwt && !prevState.isUserPresent) {
      this.setState({ isUserPresent: true });
    }

    if (!jwt && prevState.isUserPresent) {
      this.setState({ isUserPresent: false });
    }
  }

  onSelectLocation = (address, lat, lng) => {
    this.setState({ lat, lng, address });
  };

  render() {
    console.log(this.state);
    console.log(this.props);
    if (this.state.isUserPresent && !this.props.user) {
      return <LoadingScreen />;
    }

    return (
      <div
        style={{
          background:
            'linear-gradient(rgb(136, 131, 128) 0%, rgb(43, 41, 40) 99%)',
        }}
      >
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
              user={this.props.user}
              location={this.props.location}
            />
          )}
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
  };
};

const x = withCookies(LocalMarketplace);

export default connect(mapStateToProps)(x);
