import React, { Component } from 'react';

import { connect } from 'react-redux';

import MainNavBar from 'components/MainNavBar';
import Style from './style.module.scss';
import UserDuck from 'stores/ducks/User.duck';
import ProfileNavBar from './components/ProfileNavBar';

import { Img, Button } from 'fields';

import UserListings from './components/UserListings';
import Messages from './components/Messages';
import MainFooter from 'components/MainFooter';

class ProfilePage extends Component {
  state = {
    activeNavBarID: 'listings',
  };

  onChangeNavBarID = activeNavBarID =>
    this.setState({ activeNavBarID }, console.log(activeNavBarID));

  renderActiveNavBarContent = () => {
    switch (this.state.activeNavBarID) {
      case 'listings':
        return <UserListings user={this.props.user} />;
      case 'messages':
        return <Messages user={this.props.user} />;
      default:
        return null;
    }
  };

  render() {
    console.log(this.props);
    const { user } = this.props;
    return (
      <div>
        <MainNavBar />

        {this.props.user && (
          <div className={Style.pageLayout}>
            <div className={Style.pageContent}>
              <div className={Style.profileContainer}>
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
                    <h4>Reviews</h4>
                    <p>20</p>
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
              </div>

              <ProfileNavBar
                activeNavBarID={this.state.activeNavBarID}
                onChangeNavBarID={this.onChangeNavBarID}
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
  };
};

export default connect(mapStateToProps)(ProfilePage);
