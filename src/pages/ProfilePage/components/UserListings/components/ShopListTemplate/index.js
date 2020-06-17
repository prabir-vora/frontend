import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Img } from 'fields';

import { BuyIcon, PlusIcon, TickIcon, ShareIcon } from 'assets/Icons';
import Style from './style.module.scss';
import UserDuck from 'stores/ducks/User.duck';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ShowConfirmNotif } from 'functions';

class ShopListTemplate extends Component {
  render() {
    const { listing } = this.props;
    const {
      id,
      askingPrice,
      condition,
      size,
      product,
      images,
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
      <div className={Style.listItem}>
        {purchased_at && <div className={Style.soldTag}>Sold</div>}
        <a href={`/listing/${slug}`}>
          <Img src={original_image_url} className={Style.productImage} />
        </a>
        <div className={Style.listingDetails}>
          <a href={`/listing/${slug}`}>
            <div className={Style.productName}>
              <h4>{name}</h4>
            </div>
            <div>
              <div className={Style.listingDetailLabel}>{brand.name}</div>
              <div className={Style.listingDetailLabel}>
                Condition: {conditionMap[condition].label}
              </div>
              <div className={Style.listingDetailLabel}>Size: {size}</div>
            </div>
          </a>
        </div>

        <div className={Style.priceContainer}>
          <h2 className={Style.priceLabel}>${askingPrice}</h2>
        </div>
      </div>
    );
  }
}

export default ShopListTemplate;
