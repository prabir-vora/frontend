import React, { Component } from 'react';
import cx from 'classnames';
import Style from './style.module.scss';
import ScreenSize from 'fields/ScreenSize';

export default class AdminPageContainer extends Component {

    renderContentContainer = () => {
        const { children } = this.props;
        return (
          <React.Fragment>
            <ScreenSize deviceType="mobile">
              <div className={cx(Style.adminPageContainer, Style.mobile)}>
                {children}
              </div>
            </ScreenSize>
            <ScreenSize deviceType="tablet">
              <div className={cx(Style.adminPageContainer, Style.mobile)}>
                {children}
              </div>
            </ScreenSize>
            <ScreenSize deviceType="desktop">
              <div className={Style.adminPageContainer}>{children}</div>
            </ScreenSize>
          </React.Fragment>
        );
      };


      render() {
        return this.renderContentContainer();
      }
}
