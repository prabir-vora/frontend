import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';

import MapContainer from 'components/MapContainer';

import { connect } from 'react-redux';

import LocalListingDuck from 'stores/ducks/LocalListing.duck';
import ConversationDuck from 'stores/ducks/Conversation.duck';
import UserDuck from 'stores/ducks/User.duck';
import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import ReactTooltip from 'react-tooltip';

import { TickIcon, PlusIcon, ShareIcon, FavoriteIcon } from 'assets/Icons';
import { ShowConfirmNotif } from 'functions';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  ImageGallery,
  Img,
  CustomImageGallery,
  Button,
  ScreenSize,
} from 'fields';

import Style from './style.module.scss';
import cx from 'classnames';
import MainFooter from 'components/MainFooter';
import LoadingScreen from 'components/LoadingScreen';

import moment from 'moment';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

class LocalListingPage extends Component {
  state = {
    images: [],
    showDetailedImages: false,
    imageIndex: 0,
  };
  async componentDidMount() {
    const { listingID } = this.props.match.params;
    console.log(listingID);

    const { actionCreators } = LocalListingDuck;
    const { getLocalListing } = actionCreators;
    const { success, message } = await this.props.dispatch(
      getLocalListing(listingID),
    );
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: 'success',
      // });
      if (
        this.props.localListing !== null &&
        this.props.localListing !== undefined
      ) {
        const { currentSlug, listingsMap } = this.props.localListing;
        const localListing = listingsMap[currentSlug];
        this.setState({ localListing });
        // this.setState({ selectedLocalItem: product.resellItems[0], product });
      }
    } else {
      console.log(message);
    }
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  onClickAddToList = async listingID => {
    console.log(listingID);

    const { user } = this.props;

    if (!user) {
      const { actionCreators } = AppAuthDuck;
      const { showModal } = actionCreators;
      return this.props.dispatch(showModal('login'));
    }

    if (listingID === '') {
      return;
    }

    const { myLocalList } = user;

    const { actionCreators } = UserDuck;
    const { addToLocalList, removeFromLocalList } = actionCreators;

    if (myLocalList.includes(listingID)) {
      await this.props.dispatch(removeFromLocalList(listingID));
    } else {
      await this.props.dispatch(addToLocalList(listingID));
    }
  };

  openMessageModal = () => {
    const { actionCreators } = ConversationDuck;
    const { showMessageModal } = actionCreators;

    const { currentSlug, listingsMap } = this.props.localListing;
    const data = listingsMap[currentSlug];
    const { id } = data;
    this.props.dispatch(showMessageModal('localMarketplace', id));
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

  renderDetailedImages = data => {
    const { imageIndex, showDetailedImages, selectedResellItem } = this.state;

    const { images } = data;

    return (
      <React.Fragment>
        {showDetailedImages && images.length !== 0 && (
          <Lightbox
            mainSrc={images[imageIndex]}
            nextSrc={images[(imageIndex + 1) % images.length]}
            prevSrc={images[(imageIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ showDetailedImages: false })}
            onMovePrevRequest={() =>
              this.setState({
                imageIndex: (imageIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                imageIndex: (imageIndex + 1) % images.length,
              })
            }
            imageTitle={`Seller Image Uploads ${imageIndex + 1} / ${
              images.length
            }`}
            // enableZoom={false}
            // discourageDownloads={true}
          />
        )}
      </React.Fragment>
    );
  };

  renderNavigationLinks = (brand, name) => (
    <div className={Style.navigationLinkContainer}>
      <a
        style={{
          color: 'grey',
          textTransform: 'uppercase',
          fontSize: '14px',
          marginRight: '10px',
        }}
        href={`/brands/${brand.slug}`}
      >
        {brand.name}
      </a>
      <h5
        style={{
          color: 'grey',
          fontSize: '14px',
          margin: '0px 10px 0px 0px',
          textTransform: 'uppercase',
        }}
      >
        {' '}
        /{' '}
      </h5>
      <a
        style={{
          color: 'grey',
          textTransform: 'uppercase',
          fontSize: '14px',
        }}
      >
        {name}
      </a>
    </div>
  );

  renderProductImageGallery = data => {
    let imageGalleryInput = [];

    const { images } = data;

    images.forEach(pictureURL => {
      imageGalleryInput.push(pictureURL);
    });

    return (
      <React.Fragment>
        <ScreenSize deviceType="mobile">
          <CustomImageGallery
            images={imageGalleryInput}
            onClickImage={this.onClickImage}
          />
        </ScreenSize>
        <ScreenSize deviceType="tablet">
          <CustomImageGallery
            images={imageGalleryInput}
            onClickImage={() => null}
          />
        </ScreenSize>
        <ScreenSize deviceType="desktop">
          <CustomImageGallery
            images={imageGalleryInput}
            onClickImage={() => null}
          />
        </ScreenSize>
      </React.Fragment>
    );

    return (
      <CustomImageGallery
        images={imageGalleryInput}
        onClickImage={this.onClickImage}
      />
    );
  };

  onClickImage = currentIndex => {
    this.setState({
      showDetailedImages: true,
      imageIndex: currentIndex,
    });
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

    let myLocalList;

    myLocalList = user ? user.myLocalList : [];

    const isAddedToList = myLocalList.includes(data.id);

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
              marginTop: '10px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Img
              src={data.reseller.imageURL || ''}
              style={{ width: '25px', height: '25px', borderRadius: '50%' }}
            />
            <a
              href={`/${data.reseller.username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={Style.resellerLink}>{data.reseller.username}</div>
            </a>
          </div>
        </div>
        {/* {this.renderProductFeaturesList(data)} */}
        <div style={{ marginTop: '30px' }}>
          <div className={Style.detailsTitle}>Price</div>
          <div style={{ fontSize: '28px', fontWeight: '600' }}>
            ${data.askingPrice}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '30px',
          }}
        >
          <div className={Style.detailsTitle}>Approx. Location</div>
          <MapContainer
            _geoloc={data.reseller._geoloc}
            containerElement={
              <div
                style={{
                  height: `150px`,
                  width: '80%',
                }}
              />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '50px',
          }}
        >
          <button
            className={Style.buttonStyle}
            onClick={() => {
              this.openMessageModal();
            }}
          >
            <span className={Style.buttonText}>Message</span>
          </button>
          <button
            className={Style.addToListButton}
            onClick={() => this.onClickAddToList(data.id)}
            data-tip={isAddedToList ? 'Remove from My List' : 'Add to My List'}
          >
            {isAddedToList ? <TickIcon /> : <PlusIcon />}
          </button>
          <CopyToClipboard
            text={`localhost:3000/localMarketplace/${listingID}`}
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
      </React.Fragment>
    );
  };

  render() {
    const { currentSlug, listingsMap } = this.props.localListing;
    const data = listingsMap[currentSlug];

    const { listingID } = this.props.match.params;

    if (data === null || data === undefined) {
      return <LoadingScreen />;
    }

    const { product, condition, askingPrice, size, reseller } = data;

    const {
      brand,
      productCategory,
      name,
      sku,
      colorway,
      designer,
      releaseDate,
      gender,
    } = product;

    const { user } = this.props;

    let myLocalList;

    myLocalList = user ? user.myLocalList : [];

    const isAddedToList = myLocalList.includes(data.id);

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <div className={Style.productBackground}>
        <ScreenSize deviceType="desktop">
          <ReactTooltip
            html={true}
            effect="solid"
            multiline={true}
            type="light"
            className={Style.reactTooltip}
          />
        </ScreenSize>
        <MainNavBar />

        <div className={Style.productLayout}>
          <div className={Style.productContainer}>
            <Img src={brand.imageURL} className={Style.brandImage} />
            <h6 className={Style.productCategory}>{productCategory}</h6>

            <h1 className={Style.productName}>{name}</h1>
            <div className={Style.productDetailsContainer}>
              <div className={Style.productDetail}>
                <span className={Style.bold}>SKU </span> {sku}{' '}
              </div>
              <div className={Style.productDetail}>
                <span className={Style.bold}>Colorway</span>
                {colorway}
              </div>
              {designer && (
                <div className={Style.productDetail}>
                  <span className={Style.bold}>Designer</span>
                  {designer.name}
                </div>
              )}
              {releaseDate && (
                <div className={Style.productDetail}>
                  <span className={Style.bold}>Release Date</span>
                  {moment(releaseDate).format('YYYY-MM-DD')}
                </div>
              )}
              <div className={Style.productDetail}>
                <span className={Style.bold}>Seller</span>@{reseller.username}
              </div>
            </div>

            <div className={Style.conditionContainer}>
              Condition: {conditionMap[condition].label}
            </div>
            <div className={Style.sizeContainer}>Size: {size}</div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginTop: '30px',
              }}
            >
              <div className={Style.approxLocation}>Approx. Location</div>
              <MapContainer
                _geoloc={data.reseller._geoloc}
                containerElement={<div className={Style.mapContainer} />}
                mapElement={<div style={{ height: `100%` }} />}
              />
            </div>
            <div className={Style.buttonsContainer}>
              <Button
                className={Style.buyButton}
                onClick={() => {
                  this.openMessageModal();
                }}
              >
                Message
              </Button>
              {/* <Button
                className={
                  isAddedToList
                    ? cx(Style.myListButton, Style.active)
                    : Style.myListButton
                }
                onClick={() => this.onClickAddToList(data.id)}
                data-tip={
                  isAddedToList ? 'Remove from My List' : 'Add to My List'
                }
              >
                <FavoriteIcon />
              </Button> */}
            </div>
          </div>
          <div className={Style.mediaContainer}>
            {this.renderNavigationLinks(brand, name)}
            {this.renderProductImageGallery(data)}
          </div>
        </div>
        {this.renderDetailedImages(data)}
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = LocalListingDuck;

  return {
    localListing: state[duckName],
    user: state[UserDuck.duckName].user,
  };
};

export default connect(mapStateToProps)(LocalListingPage);
