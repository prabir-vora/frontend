import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';

import { connect } from 'react-redux';
import ResellListingDuck from 'stores/ducks/ResellListing.duck';
import ConversationDuck from 'stores/ducks/Conversation.duck';

import { ImageGallery, Img } from 'fields';

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
            <div style={{ marginLeft: '10px' }}>{data.reseller.name}</div>
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
            justifyContent: 'space-around',
            alignItems: 'center',
            marginTop: '50px',
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
      </React.Fragment>
    );
  };

  render() {
    const { currentSlug, listingsMap } = this.props.resellListing;
    const data = listingsMap[currentSlug];

    if (data === null || data === undefined) {
      return null;
    }

    return (
      <div>
        <MainNavBar />
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = ResellListingDuck;

  return {
    resellListing: state[duckName],
  };
};

export default connect(mapStateToProps)(ShopListingPage);
