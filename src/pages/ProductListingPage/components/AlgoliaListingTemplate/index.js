import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Img } from 'fields';

import { BuyIcon, PlusIcon, TickIcon, ShareIcon } from 'assets/Icons';
import Style from './style.module.scss';
import ReactTooltip from 'react-tooltip';
import UserDuck from 'stores/ducks/User.duck';
import AppAuthDuck from 'stores/ducks/AppAuth.duck';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ShowConfirmNotif } from 'functions';

class AlgoliaListingTemplate extends Component {
  onClickAddToList = async listingID => {
    const { user } = this.props;

    if (!user) {
      const { actionCreators } = AppAuthDuck;
      const { showModal } = actionCreators;
      return this.props.dispatch(showModal('login'));
    }

    if (listingID === '') {
      return;
    }

    const { myShopList } = user;

    const { actionCreators } = UserDuck;
    const { addToShopList, removeFromShopList } = actionCreators;

    if (myShopList.includes(listingID)) {
      await this.props.dispatch(removeFromShopList(listingID));
    } else {
      await this.props.dispatch(addToShopList(listingID));
    }
  };

  render() {
    console.log(this.props);
    const { hit } = this.props;
    const {
      listingID = '',
      condition,
      size,
      images,
      askingPrice,
      resellItemSlug,
      reseller_username,
      reseller_profile_picture = '',
    } = hit;

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    const { user } = this.props;

    let myShopList;

    myShopList = user ? user.myShopList : [];

    const isAddedToList = myShopList.includes(listingID);

    return (
      <div
        style={{
          width: '100%',
          height: '120px',
          marginBottom: '20px',
          alignItems: 'center',
          display: 'flex',
          background: '#222320',
          padding: '10px',
        }}
      >
        <ReactTooltip
          effect="solid"
          multiline={true}
          type="light"
          place="bottom"
        />
        <a
          href={`/shop/listing/${resellItemSlug}`}
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
          <a
            href={`/shop/listing/${resellItemSlug}`}
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

          <div style={{ marginTop: '20px', display: 'flex' }}>
            <Img
              src={reseller_profile_picture}
              style={{ width: '25px', height: '25px', borderRadius: '50%' }}
            />
            <a
              className={Style.resellerLink}
              href={`/${reseller_username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div style={{ marginLeft: '10px' }}>{reseller_username}</div>
            </a>
          </div>
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
            <button className={Style.buyButton}>
              <BuyIcon />
              Buy
            </button>
            <div className={Style.listButtonContainer}>
              <button
                className={Style.addToListIcon}
                onClick={() => this.onClickAddToList(listingID)}
                data-tip={
                  isAddedToList ? 'Remove from My List' : 'Add to My List'
                }
              >
                {isAddedToList ? <TickIcon /> : <PlusIcon />}
              </button>
              <CopyToClipboard
                text={`localhost:3000/shop/listing/${resellItemSlug}`}
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

const mapStateToProps = state => {
  return { user: state[UserDuck.duckName].user };
};

export default connect(mapStateToProps)(AlgoliaListingTemplate);
