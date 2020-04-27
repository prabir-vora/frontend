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
    } = hit;
    const { matchedGeoLocation } = _rankingInfo;
    const { distance } = matchedGeoLocation;
    const distanceInMiles = Math.round((distance / 1609) * 100) / 100;

    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <a
            title={name}
            href={`/localMarketplace/${resellItemSlug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <div className={Style.gridCell}>
                <div
                  style={{
                    textAlign: 'center',
                    position: 'absolute',
                    top: '7%',
                    right: '7%',
                    fontSize: '13px',
                  }}
                >
                  {distanceInMiles} miles away
                </div>
                <div className={Style.gridCellImage}>
                  <Img src={original_image_url} className={Style.gridImage} />
                </div>
                <div
                  style={{
                    textAlign: 'center',
                    fontFamily:
                      'Druk Wide Web,futura-pt,HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif',

                    fontSize: '13px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}
                >
                  {name}
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                  <a
                    className={Style.userLink}
                    href={`/user/${reseller_username}`}
                  >
                    @{reseller_username}
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
