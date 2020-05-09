import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

export default class ShopGridTemplate extends Component {
  render() {
    const { listing } = this.props;
    const { askingPrice, condition, size, product, reseller, slug } = listing;
    const { name, original_image_url } = product;
    const { username } = reseller;
    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <a
            title={name}
            target="_blank"
            rel="noopener noreferrer"
            href={`/shop/listing/${slug}`}
          >
            <div>
              <div className={Style.gridCell}>
                <div className={Style.gridCellImage}>
                  <Img src={original_image_url} className={Style.gridImage} />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily:
                      'Druk Wide Web,futura-pt,HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif',

                    fontSize: '14px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}
                >
                  {name}
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                  <a className={Style.userLink} href={`/${username}`}>
                    @{username}
                  </a>
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>${askingPrice}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}
