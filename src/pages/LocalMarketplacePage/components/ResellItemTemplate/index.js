import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

export default class ResellItemTemplate extends Component {
  render() {
    const { hit } = this.props;
    const {
      name,
      slug,
      original_image_url,
      askingPrice,
      _rankingInfo,
      reseller_name,
    } = hit;
    const { matchedGeoLocation } = _rankingInfo;
    const { distance } = matchedGeoLocation;
    const distanceInMiles = Math.round((distance / 1609) * 100) / 100;

    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <a title={name} href={`/shop/${slug}`}>
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

                    fontSize: '16px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}
                >
                  {name}
                </div>
                <br />
                <div style={{ textAlign: 'center', color: 'red' }}>
                  @{reseller_name}
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                  {distanceInMiles} miles away
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
