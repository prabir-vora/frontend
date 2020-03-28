import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import { MenuIcon } from 'assets/Icons';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

export default class MainNavBar extends Component {
  state = { showSideNavBar: false };

  onClickMenu = () => this.setState({ showNavbar: !this.state.showNavbar });

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
              to="/local"
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
          </li>
        </ul>
      </nav>
    </div>
  );

  render() {
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
            to="/local"
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
