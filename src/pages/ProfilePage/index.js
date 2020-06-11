import React, { Component } from 'react';

import { connect } from 'react-redux';

import MainNavBar from 'components/MainNavBar';
import Style from './style.module.scss';
import UserDuck from 'stores/ducks/User.duck';
import ProfileNavBar from './components/ProfileNavBar';

import { Img, Button } from 'fields';

import UserListings from './components/UserListings';
import Messages from './components/Messages';
import Orders from './components/Orders';
import Settings from './components/Settings';

import MainFooter from 'components/MainFooter';
import LoadingScreen from 'components/LoadingScreen';

import { withCookies } from 'react-cookie';
import { withRouter } from 'react-router-dom';

class ProfilePage extends Component {
  state = {
    activeNavBarID: 'listings',
    isUserPresent: false,
  };

  componentDidMount() {
    const jwt = this.props.cookies.get('jwt');
    if (jwt) {
      this.setState({ isUserPresent: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const jwt = this.props.cookies.get('jwt');
    if (jwt && !prevState.isUserPresent) {
      this.setState({ isUserPresent: true });
    }

    if (!jwt && prevState.isUserPresent) {
      this.setState({ isUserPresent: false });
    }
  }

  onChangeNavBarID = activeNavBarID => {
    if (activeNavBarID === 'settings') {
      return this.props.history.push(`/user/${activeNavBarID}/editProfile`);
    }
    this.props.history.push(`/user/${activeNavBarID}`);
  };

  renderActiveNavBarContent = () => {
    switch (this.props.match.params.activeNavBarID) {
      case 'listings':
        return <UserListings user={this.props.user} />;
      case 'messages':
        return <Messages user={this.props.user} />;
      case 'orders':
        return <Orders user={this.props.user} />;
      case 'settings':
        return <Settings user={this.props.user} />;
      default:
        return <UserListings user={this.props.user} />;
    }
  };

  render() {
    console.log(this.props);
    const { user } = this.props;

    if (this.state.isUserPresent && !user) {
      return <LoadingScreen />;
    }

    return (
      <div
        style={{
          background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
        }}
      >
        <MainNavBar />

        {this.props.user && (
          <div className={Style.pageLayout}>
            <div className={Style.pageContent}>
              {/* <div className={Style.profileContainer}>
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    marginRight: '100px',
                  }}
                >
                  <Img
                    src={
                      this.props.user.profilePictureURL ||
                      'https://i.ya-webdesign.com/images/placeholder-image-png-4.png'
                    }
                    alt={`${this.props.user.name} image`}
                    style={{ width: '80px', height: '80px' }}
                  />
                </div>

                <div
                  style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginRight: '100px',
                    }}
                  >
                    <h4>Listings</h4>
                    <p>{user.resellItems ? user.resellItems.length : 0}</p>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginRight: '100px',
                    }}
                  >
                    <h4>Joined</h4>
                    <p>March 2020</p>
                  </div>
                </div>
              </div>

              <div className={Style.profileContainer}>
                <div style={{ marginRight: '20px' }}>
                  <h4 style={{ margin: '10px' }}>{this.props.user.name}</h4>
                  <div>@{this.props.user.username}</div>
                </div>
                <Button className={Style.editProfileButton}>
                  Edit Profile
                </Button>
                <a href="/sell/createListing">
                  <Button className={Style.editProfileButton}>
                    Sell Something
                  </Button>
                </a>
              </div> */}

              <ProfileNavBar
                activeNavBarID={this.props.match.params.activeNavBarID}
                onChangeNavBarID={this.onChangeNavBarID}
                notifCount={this.props.notifCount}
              />

              <React.Fragment>
                {this.renderActiveNavBarContent()}
              </React.Fragment>
            </div>
          </div>
        )}
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
    notifCount: state[UserDuck.duckName].notifCount,
  };
};

const x = withCookies(ProfilePage);

const y = withRouter(x);

export default connect(mapStateToProps)(y);
