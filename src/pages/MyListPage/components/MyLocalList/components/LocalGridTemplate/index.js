import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

import getDistance from 'geolib/es/getDistance';

export default class LocalGridTemplate extends Component {
  state = { distanceInMiles: 0 };
  componentDidMount() {
    const { user, listing } = this.props;

    const { reseller } = listing;

    const distance = getDistance(
      { latitude: user._geoloc.lat, longitude: user._geoloc.lng },
      { latitude: reseller._geoloc.lat, longitude: reseller._geoloc.lng },
      10000,
    );

    const distanceInMiles = Math.round((distance / 1609) * 100) / 100;

    this.setState({ distanceInMiles });
  }

  render() {
    const { distanceInMiles } = this.state;
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
            href={`/localMarketplace/${slug}`}
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

                    fontSize: '14px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                  }}
                >
                  {name}
                </div>
                <br />
                <div style={{ textAlign: 'center' }}>
                  <a className={Style.userLink} href={`/user/${username}`}>
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
