import React, { Component } from 'react';
import Style from './style.module.scss';
import cx from 'classnames';

import {
  BrandsNavIcon,
  ShopNavIcon,
  SettingsIcon,
  MessagesIcon,
} from 'assets/Icons';

const NAV_BAR_ITEMS = [
  {
    id: 'listings',
    label: 'LISTINGS',
    icon: <BrandsNavIcon />,
  },
  {
    id: 'messages',
    label: 'MESSAGES',
    icon: <MessagesIcon />,
  },
  {
    id: 'orders',
    label: 'ORDERS',
    icon: <ShopNavIcon />,
  },
  {
    id: 'settings',
    label: 'SETTINGS',
    icon: <SettingsIcon />,
  },
];
export default class ProfileNavBar extends Component {
  renderNavBarItem = item => {
    const { id, label } = item;
    return (
      <div style={{ position: 'relative' }}>
        <button
          className={
            this.props.activeNavBarID === id
              ? cx(Style.navBarItem, Style.active)
              : Style.navBarItem
          }
          onClick={() => this.props.onChangeNavBarID(id)}
        >
          {label}
        </button>
        {this.renderNotifCount(id)}
      </div>
    );
  };

  renderNavBarItemMobile = item => {
    const { id, label, icon } = item;
    return (
      <div className={Style.navBarIndMobile}>
        <button
          className={
            this.props.activeNavBarID === id
              ? cx(Style.navBarItemMobile, Style.activeMobile)
              : Style.navBarItemMobile
          }
          onClick={() => this.props.onChangeNavBarID(id)}
        >
          {icon}
          {this.renderNotifCountMobile(id)}
        </button>
      </div>
    );
  };

  renderNotifCount = navbarItemID => {
    if (navbarItemID === 'messages') {
      return this.props.notifCount.messages !== 0 ? (
        <div className={Style.notifCount}>{this.props.notifCount.messages}</div>
      ) : null;
    }

    if (navbarItemID === 'orders') {
      return this.props.notifCount.orders !== 0 ? (
        <div className={Style.notifCount}>{this.props.notifCount.orders}</div>
      ) : null;
    }
  };

  renderNotifCountMobile = navbarItemID => {
    if (navbarItemID === 'messages') {
      return this.props.notifCount.messages !== 0 ? (
        <div className={Style.notifCountMobile}>
          {this.props.notifCount.messages}
        </div>
      ) : null;
    }

    if (navbarItemID === 'orders') {
      return this.props.notifCount.orders !== 0 ? (
        <div className={Style.notifCountMobile}>
          {this.props.notifCount.orders}
        </div>
      ) : null;
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className={Style.navBarContainer}>
          {NAV_BAR_ITEMS.map(this.renderNavBarItem)}
        </div>
        <div className={Style.navBarContainerMobile}>
          {NAV_BAR_ITEMS.map(this.renderNavBarItemMobile)}
        </div>
      </React.Fragment>
    );
  }
}
