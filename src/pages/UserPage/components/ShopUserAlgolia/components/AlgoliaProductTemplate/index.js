import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

export default class AlgoliaProductTemplate extends Component {
  render() {
    const { hit } = this.props;
    const { name, resellItemSlug, original_image_url, askingPrice } = hit;
    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <a
            title={name}
            target="_blank"
            rel="noopener noreferrer"
            href={`/shop/listing/${resellItemSlug}`}
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
                <div style={{ textAlign: 'center' }}>${askingPrice}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}
