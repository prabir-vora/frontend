import React, { Component } from 'react';

import Style from './style.module.scss';
import cx from 'classnames';

import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import SellerSettings from './components/SellerSettings';

import { withRouter } from 'react-router-dom';

import {
  EditProfileIcon,
  PasswordIcon,
  SellerSettingsIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
} from 'assets/Icons';

import Select from 'react-select';

const SETTINGS_NAV_BAR_ITEMS = [
  {
    id: 'editProfile',
    label: 'Edit Profile',
    icon: <EditProfileIcon />,
  },
  {
    id: 'changePassword',
    label: 'Change Password',
    icon: <PasswordIcon />,
  },
  // {
  //   id: 'savedPayments',
  //   label: 'Saved Payments',
  // },
  {
    id: 'sellerSettings',
    label: 'Seller Settings',
    icon: <SellerSettingsIcon />,
  },
];

class Settings extends Component {
  state = { activeNavBarID: 'editProfile', showDropDownMenu: false };

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

  changeNavBarID = selectedOption => {
    this.onChangeNavBarID(selectedOption.value);
  };

  renderMobileNavBar = () => {
    const filterNavBarID = SETTINGS_NAV_BAR_ITEMS.filter(
      item => this.props.match.params.settingsNavID === item.id,
    );

    const activeNavBarID = {
      value: filterNavBarID[0].id,
      label: (
        <span className={Style.dropdownMenuItem}>
          {filterNavBarID[0].icon} {filterNavBarID[0].label}
        </span>
      ),
    };

    const filteredNavList = SETTINGS_NAV_BAR_ITEMS.filter(item => {
      if (
        item.id === 'changePassword' &&
        this.props.user.serviceName !== 'password'
      ) {
        return false;
      } else {
        return true;
      }
    });

    const navList = filteredNavList.map(item => {
      return {
        value: item.id,
        label: (
          <span className={Style.dropdownMenuItem}>
            {item.icon} {item.label}
          </span>
        ),
      };
    });

    const CustomStyle = {
      option: (base, state) => ({
        ...base,
        backgroundColor: state.isSelected ? 'grey' : 'white',
        ':active': {
          backgroundColor: state.isSelected ? 'grey' : 'white',
        },
      }),
    };

    return (
      <div className={Style.dropDownContainer}>
        <Select
          options={navList}
          value={activeNavBarID}
          onChange={this.changeNavBarID}
          styles={CustomStyle}
          inputProps={{ readOnly: true }}
          isSearchable={false}
        />
      </div>
    );
  };

  renderDropDownMenu = item => {
    return (
      <li
        className={Style.dropdownMenuItem}
        onClick={() => {
          this.onChangeNavBarID(item.id);
          this.setState({
            showDropDownMenu: false,
          });
        }}
      >
        {item.icon} {item.label}
      </li>
    );
  };

  renderContent = () => (
    <div className={Style.contentContainer}>{this.renderActiveContent()}</div>
  );

  render() {
    return (
      <React.Fragment>
        <div className={Style.mobileTitle}>Settings</div>
        {this.renderMobileNavBar()}
        <div className={Style.settingsContainer}>
          {this.renderSideBar()}

          {this.renderContent()}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(Settings);
