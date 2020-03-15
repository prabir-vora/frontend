import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// Style
import Style from "./style.module.scss";


export default class NavBar extends Component {

    renderNavItem = ({ id, label, icon }) => (
        <button
          className={cx(
            Style.navbarItemContainer,
            id === this.props.activeNavbarItemId && Style.active
          )}
          onClick={() => this.props.onChangeNavItem(id)}
          key={id}
        >
          <div className={Style.iconContainer}>{icon}</div>
          <div className={Style.navbarItemLabel}>{label}</div>
        </button>
    );


    render() {
        return (
          <div className={Style.navbarContainer}>
            {this.props.navItems.map(this.renderNavItem)}
          </div>
        );
      }
}


NavBar.propTypes = {
    activeNavbarItemId: PropTypes.string.isRequired,
    navItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.any
      })
    ).isRequired,
    onChangeNavItem: PropTypes.func.isRequired,
};
  