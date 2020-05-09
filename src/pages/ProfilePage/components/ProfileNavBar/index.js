import React, { Component } from 'react';
import Style from './style.module.scss';
import cx from 'classnames';

const NAV_BAR_ITEMS = [
  {
    id: 'listings',
    label: 'LISTINGS',
  },
  {
    id: 'messages',
    label: 'MESSAGES',
  },
  {
    id: 'orders',
    label: 'ORDERS',
  },
  {
    id: 'settings',
    label: 'SETTINGS',
  },
];
export default class ProfileNavBar extends Component {
  renderNavBarItem = item => {
    const { id, label } = item;
    return (
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
    );
  };

  render() {
    return (
      <div className={Style.navBarContainer}>
        {NAV_BAR_ITEMS.map(this.renderNavBarItem)}
      </div>
    );
  }
}
