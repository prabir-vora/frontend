import React, { Component } from 'react';
import Style from './style.module.scss';
import { Img } from 'fields';

export default class ShopProductTemplate extends Component {
  render() {
    const { hit } = this.props;
    const { _id, name, productSlug, original_image_url, askingPrice } = hit;
    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <div>
            <div className={Style.gridCell}>
              <div className={Style.gridCellImage}>
                <a title={name} href={`/shop/${productSlug}`}>
                  <Img src={original_image_url} className={Style.gridImage} />
                </a>
              </div>

              <div
                style={{
                  textAlign: 'center',
                  fontFamily:
                    'Druk Wide Web,futura-pt,HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif',

                  fontSize: '11px',
                  fontWeight: '800',
                  textTransform: 'uppercase',
                }}
              >
                <a title={name} href={`/shop/${productSlug}`}>
                  {name}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
