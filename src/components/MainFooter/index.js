import React, { Component } from 'react';

import Style from './style.module.scss';

import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from 'assets/Icons';

export default class MainFooter extends Component {
  render() {
    return (
      <div className={Style.mainFooter}>
        <div className={Style.socialMediaLinks}>
          <a className={Style.socialMediaLink}>
            <FacebookIcon />
          </a>
          <a className={Style.socialMediaLink}>
            <InstagramIcon />
          </a>
          <a className={Style.socialMediaLink}>
            <TwitterIcon />
          </a>
          <a className={Style.socialMediaLink}>
            <YoutubeIcon />
          </a>
        </div>
        <ul className={Style.footerLinksContainer}>
          <li className={Style.footerLink}>
            <a href="/about">About</a>
          </li>
          <li className={Style.footerLink}>
            <a>FAQs</a>
          </li>
          <li className={Style.footerLink}>
            <a>T&C</a>
          </li>
          <li className={Style.footerLink}>
            <a>Reseller Program</a>
          </li>
          <li className={Style.footerLink}>
            <div>Dripverse © 2020</div>
          </li>
        </ul>
      </div>
    );
  }
}
