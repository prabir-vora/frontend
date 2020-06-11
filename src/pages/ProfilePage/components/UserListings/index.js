import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Img, ScreenSize, Button } from 'fields';

import UserListingsDuck from 'stores/ducks/UserListings.duck';

import InfiniteScroll from 'react-infinite-scroll-component';

import { GridViewIcon, ListViewIcon } from 'assets/Icons';
import ReactTooltip from 'react-tooltip';

import Style from './style.module.scss';
import cx from 'classnames';

import { ClipLoader } from 'react-spinners';

import ShopListTemplate from './components/ShopListTemplate';
import ShopGridTemplate from './components/ShopGridTemplate';

class UserListings extends Component {
  state = { viewType: 'gridView', isLoadingListings: true };

  async componentDidMount() {
    const { data } = this.props;

    const { actionCreators } = UserListingsDuck;
    const { fetchUserListings } = actionCreators;
    await this.props.dispatch(fetchUserListings(data.nextPage));
    this.setState({
      isLoadingListings: false,
    });
  }

  onChangeViewType = selectedViewType => {
    const { viewType } = this.state;
    if (viewType !== selectedViewType) {
      this.setState({
        viewType: selectedViewType,
      });
    }
  };

  fetchMoreListings = () => {
    const { data } = this.props;
    const { nextPage } = data;
    const { actionCreators } = UserListingsDuck;
    const { fetchUserListings } = actionCreators;
    this.props.dispatch(fetchUserListings(nextPage));
  };

  render() {
    const { viewType } = this.state;
    const { listings, hasMoreListings, loadingListings } = this.props.data;

    console.log(listings);

    return (
      <React.Fragment>
        <ScreenSize deviceType="desktop">
          <ReactTooltip
            html={true}
            id="like"
            effect="solid"
            multiline={true}
            type="light"
            className={Style.reactTooltip}
          />
        </ScreenSize>
        <div className={Style.mobileTitle}>Listings</div>
        <div className={Style.filterSummary}>
          <div className={Style.filterSummaryRowItem}>
            <div className={Style.viewTypeSelectionContainer}>
              <button
                data-tip="Grid View"
                className={
                  viewType === 'gridView'
                    ? cx(Style.viewTypeButton, Style.active)
                    : Style.viewTypeButton
                }
                onClick={() => this.onChangeViewType('gridView')}
              >
                <GridViewIcon />
              </button>
              <button
                data-tip="List View"
                className={
                  viewType === 'listView'
                    ? cx(Style.viewTypeButton, Style.active)
                    : Style.viewTypeButton
                }
                onClick={() => this.onChangeViewType('listView')}
              >
                <ListViewIcon />
              </button>
            </div>
          </div>
        </div>
        <div>
          {this.state.isLoadingListings && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <ClipLoader color={'#ffffff'} />
            </div>
          )}

          {!this.state.isLoadingListings && listings.length === 0 && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div>No Listings</div>
              <a href="/sell/">
                <Button className={Style.sellButton}>Sell Something</Button>
              </a>
            </div>
          )}
        </div>
        <InfiniteScroll
          dataLength={listings.length}
          next={this.fetchMoreListings}
          hasMore={hasMoreListings && !loadingListings}
          loader={
            <h4 style={{ color: 'white', fontSize: '12px' }}>Loading...</h4>
          }
        >
          <div
            className={
              viewType === 'gridView' ? Style.gridView : Style.listView
            }
          >
            {!this.state.isLoadingListings &&
              listings.map(listing => {
                return (
                  <React.Fragment>
                    {viewType === 'gridView' ? (
                      <ShopGridTemplate key={listing.id} listing={listing} />
                    ) : (
                      <ShopListTemplate key={listing.id} listing={listing} />
                    )}
                  </React.Fragment>
                );
              })}
          </div>
        </InfiniteScroll>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    data: state[UserListingsDuck.duckName],
  };
};

export default connect(mapStateToProps)(UserListings);
