import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';
import MainFooter from 'components/MainFooter';
import LoadingScreen from 'components/LoadingScreen';

import { connect } from 'react-redux';
import BrowseUserDuck from 'stores/ducks/BrowseUser.duck';

import { withRouter } from 'react-router-dom';

import Style from './style.module.scss';
import cx from 'classnames';

import ShopUserAlgolia from './components/ShopUserAlgolia';
import LocalUserAlgolia from './components/LocalUserAlgolia';
import { Button, Img } from 'fields';
import UserDuck from 'stores/ducks/User.duck';

class UserPage extends Component {
  state = { listingSelection: 'shop' };
  async componentDidMount() {
    const { username } = this.props.match.params;
    console.log(this.props.currentUser);
    if (
      username &&
      this.props.currentUser &&
      username === this.props.currentUser.username
    ) {
      this.props.history.push('/user');
    }

    const { actionCreators } = BrowseUserDuck;
    const { fetchCurrentBrowsedUser } = actionCreators;
    const { success } = await this.props.dispatch(
      fetchCurrentBrowsedUser(username),
    );
  }

  componentDidUpdate() {
    console.log(this.props.currentUser);
    const { username } = this.props.match.params;
    if (
      username &&
      this.props.currentUser &&
      username === this.props.currentUser.username
    ) {
      this.props.history.push('/user');
    }
  }

  toggleSelection = selection => {
    const { listingSelection } = this.props;
    const { actionCreators } = BrowseUserDuck;
    const { toggleListingSelection } = actionCreators;

    if (listingSelection !== selection) {
      this.props.dispatch(toggleListingSelection(selection));
    }
  };

  render() {
    const { user, listingSelection } = this.props;
    return (
      <div>
        {!this.props.user && <LoadingScreen />}

        {this.props.user && (
          <React.Fragment>
            <MainNavBar />
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
                      alt={`${this.props.user.username} image`}
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
                    <div>@{this.props.user.username}</div>
                  </div>
                  <Button className={Style.followButton}>Follow</Button>
                </div>

                <div className={Style.listingSelectionContainer}>
                  <span
                    className={
                      listingSelection === 'shop'
                        ? cx(Style.selectionButton, Style.activeSelection)
                        : Style.selectionButton
                    }
                    onClick={() => this.toggleSelection('shop')}
                  >
                    SHOP LISTINGS
                  </span>
                  <span className={Style.seperator}></span>
                  <span
                    className={
                      listingSelection === 'local'
                        ? cx(Style.selectionButton, Style.activeSelection)
                        : Style.selectionButton
                    }
                    onClick={() => this.toggleSelection('local')}
                  >
                    LOCAL LISTINGS
                  </span>
                </div>

                <div className={Style.algoliaContentWrapper}>
                  {listingSelection === 'shop' ? (
                    <ShopUserAlgolia reseller_username={user.username} />
                  ) : (
                    <LocalUserAlgolia user={user} />
                  )}
                </div>
              </div>
            </div>
            <MainFooter />
          </React.Fragment>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[BrowseUserDuck.duckName].user,
    currentUser: state[UserDuck.duckName].user,
    listingSelection: state[BrowseUserDuck.duckName].listingSelection,
  };
};

const x = withRouter(UserPage);
export default connect(mapStateToProps)(x);
