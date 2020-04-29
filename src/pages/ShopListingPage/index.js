import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';
import MainFooter from 'components/MainFooter';
import LoadingScreen from 'components/LoadingScreen';

import { connect } from 'react-redux';
import ResellListingDuck from 'stores/ducks/ResellListing.duck';
import ConversationDuck from 'stores/ducks/Conversation.duck';
import UserDuck from 'stores/ducks/User.duck';
import ReactTooltip from 'react-tooltip';

import { ImageGallery, Img } from 'fields';

import { TickIcon, PlusIcon, ShareIcon } from 'assets/Icons';
import { ShowConfirmNotif } from 'functions';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Style from './style.module.scss';

class ShopListingPage extends Component {
  async componentDidMount() {
    const { listingID } = this.props.match.params;
    console.log(listingID);

    const { actionCreators } = ResellListingDuck;
    const { getResellListing } = actionCreators;
    const { success, message } = await this.props.dispatch(
      getResellListing(listingID),
    );
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: 'success',
      // });
      if (
        this.props.resellListing !== null &&
        this.props.resellListing !== undefined
      ) {
        const { currentSlug, listingsMap } = this.props.resellListing;
        const resellListing = listingsMap[currentSlug];
        this.setState({ resellListing });
        // this.setState({ selectedResellItem: product.resellItems[0], product });
      }
    } else {
      console.log(message);
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onClickAddToList = async listingID => {
    if (listingID === '') {
      return;
    }
    const { user } = this.props;
    const { myShopList } = user;

    const { actionCreators } = UserDuck;
    const { addToShopList, removeFromShopList } = actionCreators;

    if (myShopList.includes(listingID)) {
      await this.props.dispatch(removeFromShopList(listingID));
    } else {
      await this.props.dispatch(addToShopList(listingID));
    }
  };

  openMessageModal = () => {
    const { actionCreators } = ConversationDuck;
    const { showMessageModal } = actionCreators;

    const { currentSlug, listingsMap } = this.props.resellListing;
    const data = listingsMap[currentSlug];
    const { id } = data;
    this.props.dispatch(showMessageModal('shop', id));
  };

  renderImageGallery = data => {
    let imageGalleryInput = [];

    const { images } = data;

    images.forEach(pictureURL => {
      imageGalleryInput.push({
        original: pictureURL,
        thumbnail: pictureURL,
      });
    });

    return (
      <div style={{ marginTop: '100px' }}>
        <ImageGallery
          items={imageGalleryInput}
          originalClass={Style.originalClass}
          thumbnailClass={Style.thumbnailClass}
          showNav={false}
          showPlayButton={false}
          showFullscreenButton={false}
          autoPlay={true}
          infinite={false}
        />
      </div>
    );
  };

  renderProductDetails = data => {
    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    const { listingID } = this.props.match.params;

    const { user } = this.props;

    if (user === null) {
      return null;
    }
    const { myShopList } = user;
    const isAddedToList = myShopList.includes(data.id);

    return (
      <React.Fragment>
        <div className={Style.detailsContainer}>
          <div className={Style.detailsBlock}>
            <div className={Style.detailsTitle}>Condition</div>
            <div className={Style.detailsContent}>
              {conditionMap[data.condition].label}
            </div>
          </div>
          <div className={Style.detailsBlock}>
            <div className={Style.detailsTitle}>Size</div>
            <div className={Style.detailsContent}>{data.size}</div>
          </div>
          {/* <div className={Style.detailsBlock}>
            <div className={Style.detailsTitle}>Price</div>
            <div className={Style.detailsContent}>{data}</div>
          </div> */}
        </div>

        <div className={Style.description}>
          <div className={Style.detailsTitle}>Seller</div>
          <div
            style={{
              marginTop: '20px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Img
              src={data.reseller.imageURL || ''}
              style={{ width: '25px', height: '25px', borderRadius: '50%' }}
            />
            <a href={`/user/${data.reseller.username}`}>
              <div className={Style.resellerLink}>{data.reseller.username}</div>
            </a>
          </div>
        </div>
        {/* {this.renderProductFeaturesList(data)} */}
        <div style={{ marginTop: '40px' }}>
          <div className={Style.detailsTitle}>Price</div>
          <div style={{ fontSize: '28px', fontWeight: '600' }}>
            ${data.askingPrice}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: '50px',
          }}
        >
          <div className={Style.buttonContainer}>
            <button
              className={Style.addToListButton}
              onClick={() => this.onClickAddToList(data.id)}
              data-tip={
                isAddedToList ? 'Remove from My List' : 'Add to My List'
              }
            >
              {isAddedToList ? <TickIcon /> : <PlusIcon />}
            </button>
            <CopyToClipboard
              text={`localhost:3000/shop/listing/${listingID}`}
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
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <button
              className={Style.buttonStyle}
              // onClick={() => {
              //   this.setState({ viewResellers: true });
              // }}
            >
              <span className={Style.buttonText}>Buy</span>
            </button>
            <button
              className={Style.buttonStyle}
              onClick={() => {
                this.openMessageModal();
              }}
            >
              <span className={Style.buttonText}>Message</span>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  };

  render() {
    const { currentSlug, listingsMap } = this.props.resellListing;
    const data = listingsMap[currentSlug];

    if (data === null || data === undefined) {
      return <LoadingScreen />;
    }

    return (
      <div>
        <MainNavBar />
        <ReactTooltip
          effect="solid"
          multiline={true}
          type="light"
          place="bottom"
        />
        <div className={Style.pageLayout}>
          <div style={{ display: 'flex' }}>
            <div className={Style.mediaContainer}>
              {this.renderImageGallery(data)}
            </div>
            <div className={Style.productContainer}>
              <div className={Style.contentContainer}>
                <div className={Style.content}>
                  <div className={Style.productName}>{data.product.name}</div>
                  <div style={{ width: '100%' }}>
                    {this.renderProductDetails(data)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = ResellListingDuck;

  return {
    resellListing: state[duckName],
    user: state[UserDuck.duckName].user,
  };
};

export default connect(mapStateToProps)(ShopListingPage);
