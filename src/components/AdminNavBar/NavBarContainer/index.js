import React, { Component } from "react";
// import PropTypes from "prop-types";

// Components
import NavBar from "../NavBar";

// Style
import Style from "./style.module.scss";

// Icons
import { MenuIcon } from "assets/Icons";

// Fields
import ScreenSize from "fields/ScreenSize";

class NavBarContainer extends Component {
    state = { showNavbar: false };

    componentWillMount() {
        document.addEventListener("mousedown", this.onHandleClick, false);
    }

    componentWillUnmount() {
        document.addEventListener("mousedown", this.onHandleClick, false);
    }

    onChangeNavItem = navItemID => {
        this.setState({ showNavbar: false }, () =>
          this.props.onChangeNavItem(navItemID)
        );
    };

    onClickMenu = () => this.setState({ showNavbar: !this.state.showNavbar });

    onHandleClick = e => {
        if (this.node) {
          this.setState({ showNavbar: this.node.contains(e.target) });
        }
      };

    renderAdminNavbar = (device = "desktop") => {
        const navbar = (
          <div
            className={Style.navBarContainer}
            ref={node => (this.node = node)}
          >
            <div className={Style.navBarSubContainer}>
              <div className={Style.title}>Dashboard</div>
                <div className={Style.itemsColumn}>
                    <NavBar 
                        activeNavbarItemId={this.props.activeNavbarItemId}
                        navItems={this.props.navItems}
                        onChangeNavItem={this.onChangeNavItem}
                    />
                </div>
              <div className={Style.poweredBy}>
                <p>© Resell Marketplace, Inc. 2020. All Rights Reserved.</p>
              </div>
            </div>
          </div>
        );
        if (device === "desktop") return navbar;
        else
          return this.state.showNavbar ? (
            navbar
          ) : (
            <button className={Style.menuIconContainer} onClick={this.onClickMenu}>
              <MenuIcon />
            </button>
          );
      };

      render() {
        return (
          <React.Fragment>
            <ScreenSize deviceType="mobile">
              {this.renderAdminNavbar("mobile")}
            </ScreenSize>
            <ScreenSize deviceType="tablet">
              {this.renderAdminNavbar("tablet")}
            </ScreenSize>
            <ScreenSize deviceType="desktop">
              {this.renderAdminNavbar("desktop")}
            </ScreenSize>
          </React.Fragment>
        );
      }
}

export default NavBarContainer;