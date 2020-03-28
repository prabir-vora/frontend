import React, { Component } from 'react';
import Style from './style.module.scss';

import { Img } from 'fields';

export default class AlgoliaProductTemplate extends Component {
  render() {
    const { hit } = this.props;
    const { name, slug, original_image_url, askingPrice } = hit;
    return (
      <div className={Style.gridCellWrapper}>
        <div className={Style.gridCellContent}>
          <a title={name} href={`/${slug}`}>
            <div>
              <div className={Style.gridCell}>
                <div className={Style.gridCellImage}>
                  <Img src={original_image_url} className={Style.gridImage} />
                </div>
                <div style={{ textAlign: 'center' }}>{name}</div>
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