import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

export default class ShopGridTemplate extends Component {
  render() {
    const { listing } = this.props;
    const {
      askingPrice,
      condition,
      size,
      product,
      slug,
      purchased_at,
      sold,
    } = listing;
    const { name, original_image_url, brand } = product;

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <div className={Style.gridCellWrapper}>
        {purchased_at && <div className={Style.soldTag}>Sold</div>}
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
                <br />
                <div className={Style.brandSizeCondition}>
                  {brand.name} - {size} / {conditionMap[condition].label}
                </div>
                <br />
                <div className={Style.productName}>{name}</div>
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
