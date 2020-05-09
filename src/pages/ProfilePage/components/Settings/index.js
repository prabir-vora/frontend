import React, { Component } from 'react';

import Style from './style.module.scss';
import cx from 'classnames';

import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import SellerSettings from './components/SellerSettings';

import { withRouter } from 'react-router-dom';

const SETTINGS_NAV_BAR_ITEMS = [
  {
    id: 'editProfile',
    label: 'Edit Profile',
  },
  {
    id: 'changePassword',
    label: 'Change Password',
  },
  {
    id: 'savedPayments',
    label: 'Saved Payments',
  },
  {
    id: 'sellerSettings',
    label: 'Seller Settings',
  },
];

class Settings extends Component {
  state = { activeNavBarID: 'editProfile' };

  onChangeNavBarID = settingsNavID =>
    this.props.history.push(`/user/settings/${settingsNavID}`);

  renderNavBarItem = item => {
    const { id, label } = item;

    if (id === 'changePassword' && this.props.user.serviceName !== 'password') {
      return null;
    }

    return (
      <li
        className={
          this.props.match.params.settingsNavID === id
            ? cx(Style.navBarItem, Style.active)
            : Style.navBarItem
        }
        onClick={() => this.onChangeNavBarID(id)}
      >
        {label}
      </li>
    );
  };

  renderSideBar = () => (
    <div className={Style.sidebarContainer}>
      <div className={Style.sidebar}>
        <ul className={Style.navList}>
          {SETTINGS_NAV_BAR_ITEMS.map(this.renderNavBarItem)}
        </ul>
      </div>
    </div>
  );

  renderActiveContent = () => {
    switch (this.props.match.params.settingsNavID) {
      case 'editProfile':
        return <EditProfile user={this.props.user} />;
      case 'changePassword':
        return <ChangePassword />;
      case 'sellerSettings':
        return <SellerSettings user={this.props.user} />;
      default:
        return null;
    }
  };

  renderContent = () => (
    <div className={Style.contentContainer}>{this.renderActiveContent()}</div>
  );

  render() {
    return (
      <div className={Style.settingsContainer}>
        {this.renderSideBar()}
        {this.renderContent()}
      </div>
    );
  }
}

export default withRouter(Settings);
