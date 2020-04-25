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
    const { id, askingPrice, condition, size, product, images, slug } = listing;
    const { name, original_image_url } = product;

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <div
        style={{
          width: '80%',
          height: '140px',
          marginBottom: '20px',
          alignItems: 'center',
          display: 'flex',
          background: '#222320',
          padding: '10px',
        }}
      >
        <a
          href={`/shop/listing/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Img
            src={images && images.length > 0 && images[0]}
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#e0e0e0',
            }}
          />
        </a>

        <div
          style={{
            color: 'white',
            fontSize: '12px',
            marginLeft: '30px',
            marginTop: '10px',
          }}
        >
          <h4>{name}</h4>
          <a
            href={`/shop/listing/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div>
              <div style={{ marginBottom: '10px' }}>
                Condition: {conditionMap[condition].label}
              </div>
              <div>Size: {size}</div>
            </div>
          </a>
        </div>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div style={{ marginRight: '20px' }}>
            <h2 style={{ color: 'white', margin: '10px' }}>${askingPrice}</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button className={Style.buyButton}>Edit</button>
            <div className={Style.listButtonContainer}>
              <CopyToClipboard
                text={`localhost:3000/shop/listing/${slug}`}
                onCopy={() => {
                  this.confirmNotif = ShowConfirmNotif({
                    message: 'Link Copied',
                    type: 'success',
                  });
                }}
              >
                <button className={Style.shareIcon} data-tip="Share">
                  <ShareIcon />
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShopListTemplate;
