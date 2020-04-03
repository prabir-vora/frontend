import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { MenuIcon } from 'assets/Icons';

import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';

import { withCookies } from 'react-cookie';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

class MainNavBar extends Component {
  state = { showSideNavBar: false };

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
        <ul style={{ padding: '0' }}>
          <li>
            <NavLink
              to="/"
              className={Style.sideBarNavLink}
              activeClassName={Style.sideBarNavLinkActive}
            >
              <span className={Style.navLinkText}>Discover</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/shop"
              className={Style.sideBarNavLink}
              activeClassName={Style.sideBarNavLinkActive}
            >
              <span className={Style.navLinkText}>Shop</span>
            </NavLink>
          </li>
          <li>
            <NavLink
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
            <NavLink
              to="/brands"
              className={Style.sideBarNavLink}
              activeClassName={Style.sideBarNavLinkActive}
            >
              <span className={Style.navLinkText}>Become A Reseller</span>
            </NavLink>
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
      </nav>
    </div>
  );

  render() {
    console.log(this.props);

    return (
      <nav className={Style.mainNavBar}>
        <div className={Style.navBarContent}>
          {this.sideNavigationMenu()}
          <NavLink
            exact
            to="/"
            className={cx(Style.mainHeaderNavLink, Style.logo)}
          >
            DripVerse
          </NavLink>
          <NavLink
            exact
            to="/"
            className={Style.mainHeaderNavLink}
            activeClassName={Style.mainHeaderNavLinkActive}
          >
            Discover
          </NavLink>
          <NavLink
            to="/shop"
            className={Style.mainHeaderNavLink}
            activeClassName={Style.mainHeaderNavLinkActive}
          >
            Shop
          </NavLink>
          <NavLink
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
            Resellers
          </NavLink>
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

export default connect(mapStateToProps)(x);
