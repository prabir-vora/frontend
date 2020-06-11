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
          <a title={name} href={`/shop/${productSlug}`}>
            <div>
              <div className={Style.gridCell}>
                <div className={Style.gridCellImage}>
                  <Img src={original_image_url} className={Style.gridImage} />
                </div>

                <div className={Style.productName}>{name}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}
