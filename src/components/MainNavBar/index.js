import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  MenuIcon,
  SearchIcon,
  CloseIcon,
  ShopNavIcon,
  LocationNavIcon,
  BrandsNavIcon,
  SellNavIcon,
  MyListNavIcon,
  HomeNavIcon,
  UserIcon,
} from 'assets/Icons';

import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';
import ConversationDuck from 'stores/ducks/Conversation.duck';
import OrdersDuck from 'stores/ducks/Orders.duck';
import UserListingsDuck from 'stores/ducks/UserListings.duck';

import { withCookies } from 'react-cookie';

import { Img } from 'fields';

import qs from 'query-string';

import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, Configure } from 'react-instantsearch-dom';

import SearchInput from './components/SearchInput';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

class MainNavBar extends Component {
  state = { showSideNavBar: false, searchInput: '' };

  componentDidMount = () => {
    const { url = '' } = this.props.match;

    if (url === '/search') {
      const parsed = qs.parse(this.props.location.search);
      console.log(parsed);

      const { searchInput = '' } = parsed;

      this.setState({
        searchInput,
      });
    }
  };

  removeSearch = () => {
    return this.props.history.push({ pathname: '/search' });
  };

  onChangeSearchInput = searchInput => {
    this.setState({
      searchInput,
    });
  };

  onClickSearch = e => {
    e.preventDefault();
    const { searchInput } = this.state;

    console.log(searchInput);

    if (searchInput === '') {
      return this.props.history.push({ pathname: '/search' });
    }

    const query = qs.stringify({ searchInput });

    this.props.history.push({ search: query });
  };

  onProductSelection = selection => {
    console.log(selection);
    const { productSlug } = selection;

    this.props.history.push(`/shop/${productSlug}`);
    // this.setState(
    //   {
    //     resellItemInfo: immutable.set(
    //       this.state.resellItemInfo,
    //       'product',
    //       selection,
    //     ),
    //   },
    //   this.onGetButtonStatus,
    // );
  };

  protectedRouteClick = route => {
    if (!this.props.user) {
      const { showModal } = AppAuthDuck.actionCreators;
      this.props.dispatch(showModal('login'));
    } else {
      this.props.history.push(`/${route}`);
    }
  };

  onClickMenu = () => this.setState({ showNavbar: !this.state.showNavbar });

  onSignUp = () => {
    const { actionCreators } = AppAuthDuck;
    const { showModal } = actionCreators;
    this.setState({ showNavbar: false });
    this.props.dispatch(showModal('signUp'));
  };

  onLogin = () => {
    const { actionCreators } = AppAuthDuck;
    const { showModal } = actionCreators;
    this.setState({ showNavbar: false });
    this.props.dispatch(showModal('login'));
  };

  onLogOut = () => {
    this.props.cookies.remove('jwt', { path: '/' });
    const { actionCreators } = UserDuck;
    const { logOutUser } = actionCreators;
    const { clearMessages } = ConversationDuck.actionCreators;
    const { clearOrders } = OrdersDuck.actionCreators;
    const { clearListings } = UserListingsDuck.actionCreators;
    this.setState({ showNavbar: false });
    this.props.dispatch(logOutUser());
    this.props.dispatch(clearMessages());
    this.props.dispatch(clearOrders());
    this.props.dispatch(clearListings());
  };

  sideNavigationMenu = () => (
    <div className={Style.sideBarContainer}>
      <button className={Style.menuIcon} onClick={this.onClickMenu}>
        <MenuIcon />
      </button>
      <label
        className={
          this.state.showNavbar
            ? Style.navOverlay
            : cx(Style.navOverlay, Style.hidden)
        }
      >
        <div
          className={Style.overlayCover}
          onClick={() => this.setState({ showNavbar: false })}
        />
      </label>
      <nav
        className={
          this.state.showNavbar
            ? Style.slidingNavBar
            : Style.slidingNavBarHidden
        }
      >
        <div className={Style.slidingNavBarOverlay}>
          <ul style={{ padding: '0' }}>
            <li>
              <NavLink
                exact
                to="/"
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
              >
                <span className={Style.navLinkText}>Discover</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/shop"
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
              >
                <span className={Style.navLinkText}>Shop</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/localMarketplace"
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
              >
                <span className={Style.navLinkText}>Local</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/resellers"
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
              >
                <span className={Style.navLinkText}>Resellers</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/brands"
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
              >
                <span className={Style.navLinkText}>Brands</span>
              </NavLink>
              <label
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
                onClick={() => this.protectedRouteClick('sell')}
              >
                <span className={Style.navLinkText}>Sell</span>
              </label>
              {/* <label
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
                onClick={() => this.protectedRouteClick('myList')}
              >
                <span className={Style.navLinkText}>My List</span>
              </label> */}
              <React.Fragment>
                {!this.props.user ? (
                  <div className={Style.sideBarAuthLink}>
                    <button style={{ color: 'white' }} onClick={this.onLogin}>
                      Login
                    </button>
                    <button style={{ color: 'white' }} onClick={this.onSignUp}>
                      Sign Up
                    </button>
                  </div>
                ) : (
                  <React.Fragment>
                    <div className={Style.sideBarNavLink}>
                      <button
                        className={Style.navLinkText}
                        onClick={this.onLogOut}
                      >
                        Logout
                      </button>
                    </div>
                    <p
                      style={{
                        color: '#888888',
                        margin: '10px 0px',
                        padding: '10px 20px',
                      }}
                    >
                      {this.props.user.email}
                    </p>
                  </React.Fragment>
                )}
              </React.Fragment>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );

  renderSideNavMenu = () => (
    <div className={Style.sideBarContainer}>
      <button className={Style.menuIcon} onClick={this.onClickMenu}>
        <MenuIcon />
      </button>
      <label
        className={
          this.state.showNavbar
            ? Style.navOverlay
            : cx(Style.navOverlay, Style.hidden)
        }
      >
        <div
          className={Style.overlayCover}
          onClick={() => this.setState({ showNavbar: false })}
        />
      </label>
      <nav
        className={
          this.state.showNavbar
            ? Style.slidingNavBar
            : Style.slidingNavBarHidden
        }
      >
        <div className={Style.slidingNavBarOverlay}>
          <div
            onClick={() => this.setState({ showNavbar: false })}
            className={Style.closeSideBarButton}
          >
            <CloseIcon />
          </div>
          <div className={Style.authButtonsContainer}>
            {!this.props.user ? (
              <React.Fragment>
                <button className={Style.authButton} onClick={this.onSignUp}>
                  Sign Up
                </button>
                <button className={Style.authButton} onClick={this.onLogin}>
                  Login
                </button>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <NavLink exact to="/user/listings" className={Style.userLink}>
                  {this.props.user.name}
                </NavLink>
              </React.Fragment>
            )}
          </div>

          <ul className={Style.navLinkTable}>
            <li>
              <NavLink
                exact
                to="/"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <HomeNavIcon />
                <div className={Style.navLinkContent}>Home</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/shop"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <ShopNavIcon />
                <div className={Style.navLinkContent}>Shop</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/localMarketplace"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <LocationNavIcon />
                <div className={Style.navLinkContent}>Local</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/brands"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <BrandsNavIcon />
                <div className={Style.navLinkContent}>Brands</div>
              </NavLink>
            </li>
            <li>
              <label
                className={
                  this.props.match.url === '/sell'
                    ? cx(Style.navLink, Style.navLinkActive)
                    : Style.navLink
                }
                onClick={() => this.protectedRouteClick('sell')}
              >
                <SellNavIcon />
                <div className={Style.navLinkContent}>Sell</div>
              </label>
            </li>
            {/* <li>
              <label
                className={Style.navLink}
                onClick={() => this.protectedRouteClick('myList')}
              >
                <MyListNavIcon />
                <div className={Style.navLinkContent}>My List</div>
              </label>
            </li> */}
            <li>
              <NavLink
                exact
                to="/about"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <MyListNavIcon />
                <div className={Style.navLinkContent}>About Us</div>
              </NavLink>
            </li>
          </ul>
          <div className={Style.logoutButtonContainer}>
            {this.props.user && (
              <button className={Style.authButton} onClick={this.onLogOut}>
                Log out
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );

  render() {
    console.log(this.props);

    const { url = '' } = this.props.match;

    // const parsed = qs.parse(this.props.location.search);

    const { searchInput } = this.state;

    return (
      <nav className={Style.mainNavBar}>
        <div className={Style.navBarContent}>
          {this.renderSideNavMenu()}

          {/* <div style={{ display: 'flex', alignItems: 'center' }}>
            
            <NavLink
              exact
              to="/"
              className={Style.mainHeaderNavLink}
              activeClassName={Style.mainHeaderNavLinkActive}
            >
              Discover
            </NavLink>
            <NavLink
              exact
              to="/shop"
              className={Style.mainHeaderNavLink}
              activeClassName={Style.mainHeaderNavLinkActive}
            >
              Shop
            </NavLink>
            <NavLink
              exact
              to="/localMarketplace"
              className={Style.mainHeaderNavLink}
              activeClassName={Style.mainHeaderNavLinkActive}
            >
              Local
            </NavLink>
            <NavLink
              to="/resellers"
              className={Style.mainHeaderNavLink}
              activeClassName={Style.mainHeaderNavLinkActive}
            >
              Brands
            </NavLink>
            {this.props.user && (
              <NavLink
                to="/myList"
                className={Style.mainHeaderNavLink}
                activeClassName={Style.mainHeaderNavLinkActive}
              >
                My List
              </NavLink>
            )}
          </div> */}
          {url === '/search' ? (
            <InstantSearch
              indexName="test_PRODUCT_LISTINGS"
              searchClient={searchClient}
              className={Style.formFieldContainer}
            >
              <Configure
                hitsPerPage={6}
                distinct={true}
                // filters={`productCategory:${this.state.resellItemInfo.productType}`}
              />
              <form
                onSubmit={this.onClickSearch}
                className={Style.searchContainerWithButton}
              >
                <div className={Style.searchContainer}>
                  {/* <label className={Style.searchInputContainer}>
                    <input
                      className={Style.searchInput}
                      maxLength="80"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      placeholder="Search Product, Brand, Designer, SKU ..."
                      onChange={e => this.onChangeSearchInput(e.target.value)}
                      value={searchInput}
                      autoFocus
                    />
                  </label>
                  <div className={Style.searchInputOverlay}>
                    <span className={Style.searchLogo}>
                      <SearchIcon />
                    </span>
                    <button
                      className={Style.cancelSearchButton}
                      onClick={() => this.removeSearch()}
                    >
                      <CloseIcon />
                    </button>
                  </div> */}
                  <SearchInput
                    onChange={this.onChangeSearchInput}
                    value={this.state.searchInput}
                    onProductSelection={this.onProductSelection}
                    onSuggestionCleared={this.onSuggestionCleared}
                  />
                </div>
                <button className={Style.searchButton} type={'submit'}>
                  Search
                </button>
              </form>
            </InstantSearch>
          ) : (
            <React.Fragment>
              <NavLink
                exact
                to="/"
                className={cx(Style.mainHeaderNavLink, Style.logo)}
              >
                DRIPVERSE
              </NavLink>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {this.props.user && (
                  <div className={Style.userAccountContainer}>
                    <NavLink
                      className={Style.userIcon}
                      exact
                      to="/user/listings"
                    >
                      <UserIcon />
                    </NavLink>
                    {(this.props.notifCount && this.props.notifCount.total) !==
                      0 && (
                      <div className={Style.notifCount}>
                        {this.props.notifCount.total}
                      </div>
                    )}
                  </div>
                )}

                <NavLink exact to="/search">
                  <SearchIcon />
                </NavLink>
              </div>
            </React.Fragment>
          )}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
    notifCount: state[UserDuck.duckName].notifCount,
  };
};

const x = withCookies(MainNavBar);

const y = withRouter(x);

export default connect(mapStateToProps)(y);
