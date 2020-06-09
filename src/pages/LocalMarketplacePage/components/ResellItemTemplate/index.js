import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

export default class ResellItemTemplate extends Component {
  render() {
    const { hit } = this.props;
    const {
      name,
      resellItemSlug,
      original_image_url,
      askingPrice,
      _rankingInfo,
      reseller_username,
      brand_name,
      condition,
      size,
    } = hit;
    const { matchedGeoLocation } = _rankingInfo;
    const { distance } = matchedGeoLocation;
    const distanceInMiles = Math.round((distance / 1609) * 100) / 100;

    const conditionMap = {
      new: { label: 'New, Deadstock', order: 1 },
      new_defects: { label: 'New, Defects', order: 3 },
      new_opened: { label: 'New, Opened', order: 2 },
      preowned: { label: 'Preowned', order: 4 },
    };

    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <a title={name} href={`/localMarketplace/${resellItemSlug}`}>
            <div>
              <div className={Style.gridCell}>
                <div className={Style.distance}>{distanceInMiles} miles</div>
                <div className={Style.resellerTag}>
                  <div>@{reseller_username}</div>
                </div>
                <div className={Style.gridCellImage}>
                  <Img src={original_image_url} className={Style.gridImage} />
                </div>

                <div className={Style.brandAndPrice}>
                  <div
                    style={{ textAlign: 'center', color: '#b5b0ae' }}
                    className={Style.brandSizeCondition}
                  >
                    {brand_name} - {size} / {conditionMap[condition].label}
                  </div>
                  <div style={{ textAlign: 'center' }}>${askingPrice}</div>
                </div>
              </div>
              <div className={Style.gridCellBackground}>
                <div className={Style.gridCellProductName}>{name}</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    );
  }
}
