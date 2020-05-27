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
} from 'assets/Icons';

import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';

import { withCookies } from 'react-cookie';

import { Img } from 'fields';

import qs from 'query-string';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

class MainNavBar extends Component {
  state = { showSideNavBar: false };

  removeSearch = () => {
    return this.props.history.push({ pathname: '/search' });
  };

  onChangeSearchInput = searchInput => {
    if (searchInput === '') {
      return this.props.history.push({ pathname: '/search' });
    }
    const query = qs.stringify({ searchInput });

    this.props.history.push({ search: query });
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
    this.setState({ showNavbar: false });
    this.props.dispatch(logOutUser());
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
              <label
                className={Style.sideBarNavLink}
                activeClassName={Style.sideBarNavLinkActive}
                onClick={() => this.protectedRouteClick('myList')}
              >
                <span className={Style.navLinkText}>My List</span>
              </label>
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
                <NavLink exact to="/user" className={Style.userLink}>
                  {this.props.user.name}
                </NavLink>
              </React.Fragment>
            )}
          </div>
          <ul className={Style.navLinkTable}>
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
              <NavLink
                exact
                to="/sell"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <SellNavIcon />
                <div className={Style.navLinkContent}>Sell</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                to="/myList"
                className={Style.navLink}
                activeClassName={Style.navLinkActive}
              >
                <MyListNavIcon />
                <div className={Style.navLinkContent}>My List</div>
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

    const parsed = qs.parse(this.props.location.search);

    const { searchInput = '' } = parsed;

    return (
      <nav className={Style.mainNavBar}>
        <div className={Style.navBarContent}>
          {this.renderSideNavMenu()}

          <NavLink
            exact
            to="/"
            className={cx(Style.mainHeaderNavLink, Style.logo)}
          >
            DRIPVERSE
          </NavLink>

          {url === '/search' ? (
            <div className={Style.searchContainer}>
              <label className={Style.searchInputContainer}>
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
              </div>
            </div>
          ) : (
            <NavLink exact to="/search">
              <SearchIcon />
            </NavLink>
          )}
        </div>
      </nav>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
  };
};

const x = withCookies(MainNavBar);

const y = withRouter(x);

export default connect(mapStateToProps)(y);
