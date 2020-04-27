import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainNavBar from 'components/MainNavBar';
import MainFooter from 'components/MainFooter';
import UserDuck from 'stores/ducks/User.duck';
import MyListDuck from 'stores/ducks/MyList.duck';

import Style from './style.module.scss';
import cx from 'classnames';

import MyShopList from './components/MyShopList';
import MyLocalList from './components/MyLocalList';

class MyListPage extends Component {
  state = { listingSelection: 'shop' };

  componentDidMount() {
    const { actionCreators } = MyListDuck;
    const { fetchUserShopList, fetchUserLocalList } = actionCreators;
    this.props.dispatch(fetchUserShopList());
    this.props.dispatch(fetchUserLocalList());
  }

  toggleSelection = selection => {
    const { listingSelection } = this.props;
    const { actionCreators } = MyListDuck;
    const { toggleListingSelection } = actionCreators;

    if (listingSelection !== selection) {
      this.props.dispatch(toggleListingSelection(selection));
    }
  };

  render() {
    const { listingSelection } = this.props;

    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1>My List</h1>
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

            <div className={Style.contentWrapper}>
              {listingSelection === 'shop' ? (
                <MyShopList listings={this.props.myShopList} />
              ) : (
                <MyLocalList
                  listings={this.props.myLocalList}
                  user={this.props.user}
                />
              )}
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
    listingSelection: state[MyListDuck.duckName].listingSelection,
    myShopList: state[MyListDuck.duckName].myShopList,
    myLocalList: state[MyListDuck.duckName].myLocalList,
  };
};
export default connect(mapStateToProps)(MyListPage);
