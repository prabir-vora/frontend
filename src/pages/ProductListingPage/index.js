import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';

import ProductImageGallery from './components/ProductImageGallery';

import moment from 'moment';

import { connect } from 'react-redux';
import ProductListingDuck from 'stores/ducks/ProductListing.duck';
import NumberOfLikesDuck from 'stores/ducks/NumberOfLikes.duck';

import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';
import CheckoutDuck from 'stores/ducks/Checkout.duck';

import { CopyToClipboard } from 'react-copy-to-clipboard';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

import { Button, Img } from 'fields';
import MainFooter from 'components/MainFooter';
import { FireIcon, FavoriteIcon } from 'assets/Icons';

import ReactTooltip from 'react-tooltip';
import LoadingScreen from 'components/LoadingScreen';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { ClipLoader } from 'react-spinners';

class ProductListingPage extends Component {
  confirmNotif = null;
  state = {
    viewResellers: false,
    selectedResellItem: '',
    selectedCondition: '',
    selectedSize: '',
    newSizeMap: {},
    usedSizeMap: {},
    error: '',
    images: [],
    showDetailedImages: false,
    imageIndex: 0,
    isCreatingOrder: false,
  };

  async componentDidMount() {
    const { productListingID } = this.props.match.params;
    const { actionCreators } = ProductListingDuck;
    const { getProductListing } = actionCreators;
    const { success, message } = await this.props.dispatch(
      getProductListing(productListingID),
    );
    if (success) {
      //   this.confirmNotif = ShowConfirmNotif({
      //     message,
      //     type: 'success',
      //   });
      if (
        this.props.productListing !== null &&
        this.props.productListing !== undefined
      ) {
        const { currentSlug, listingsMap } = this.props.productListing;
        const product = listingsMap[currentSlug];
        const { fetchNumberOfLikes } = NumberOfLikesDuck.actionCreators;
        const numberOfLikes = await this.props.dispatch(
          fetchNumberOfLikes(product.id),
        );
        this.setState({ numberOfLikes });
        this.constructSizeMap(product);
      }
    } else {
      console.log(message);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    ReactTooltip.rebuild();

    if (prevProps.user !== this.props.user) {
      const { currentSlug, listingsMap } = this.props.productListing;
      const product = listingsMap[currentSlug];
      if (!product) {
        return;
      }
      this.constructSizeMap(product);
      this.setState({
        selectedResellItem: '',
        selectedCondition: '',
        selectedSize: '',
      });
    }
  }

  onClickLike = async productID => {
    const { user } = this.props;

    if (!user) {
      const { actionCreators } = AppAuthDuck;
      const { showModal } = actionCreators;
      return this.props.dispatch(showModal('login'));
    }

    const { likedProducts } = user;

    const { actionCreators } = UserDuck;
    const { followProduct, unfollowProduct } = actionCreators;

    if (likedProducts.includes(productID)) {
      await this.props.dispatch(unfollowProduct(productID));

      const { fetchNumberOfLikes } = NumberOfLikesDuck.actionCreators;
      const numberOfLikes = await this.props.dispatch(
        fetchNumberOfLikes(productID),
      );
      this.setState({ numberOfLikes });
    } else {
      await this.props.dispatch(followProduct(productID));
      const { fetchNumberOfLikes } = NumberOfLikesDuck.actionCreators;
      const numberOfLikes = await this.props.dispatch(
        fetchNumberOfLikes(productID),
      );
      this.setState({ numberOfLikes });
    }
  };

  onClickBuy = async () => {
    const { user } = this.props;

    if (!user) {
      const { actionCreators } = AppAuthDuck;
      const { showModal } = actionCreators;
      return this.props.dispatch(showModal('login'));
    }

    this.setState({
      isCreatingOrder: true,
    });

    const { selectedResellItem } = this.state;

    if (!selectedResellItem) {
      return;
    }

    const { actionCreators } = CheckoutDuck;
    const { createOrder } = actionCreators;

    const { success, message, orderNumber } = await this.props.dispatch(
      createOrder(selectedResellItem),
    );
    if (success) {
      this.props.history.push(`/orders/${orderNumber}`);
      this.setState({
        isCreatingOrder: false,
      });
    } else {
      this.setState({
        error: message,
        isCreatingOrder: false,
      });
    }
  };

  renderProductImageGallery = data => {
    let imageGalleryInput = [];

    const { original_image_url, additional_pictures } = data;

    imageGalleryInput.push(original_image_url);
    additional_pictures.forEach(pictureURL => {
      imageGalleryInput.push(pictureURL);
    });

    return <ProductImageGallery images={imageGalleryInput} />;
  };

  buyButtonStatus = () => {
    if (this.state.selectedResellItem) {
      return 'active';
    } else {
      return 'inactive';
    }
  };

  onSelectCondition = condition => {
    this.setState(
      {
        selectedCondition: condition,
        selectedResellItem: null,
      },
      () => console.log(this.state),
    );
  };

  constructSizeMap = product => {
    const { resellItems } = product;

    let newSizeMap = {};
    let usedSizeMap = {};

    const userFilteredResellItems = resellItems.filter(listing => {
      if (this.props.user) {
        return listing.reseller.id !== this.props.user.id;
      } else {
        return true;
      }
    });

    userFilteredResellItems.forEach(resellItem => {
      const { id, condition, size, askingPrice } = resellItem;

      if (
        condition === 'new' ||
        condition === 'new_opened' ||
        condition === 'new_defects'
      ) {
        const currentLowestPrice = newSizeMap[size];

        if (currentLowestPrice && askingPrice < currentLowestPrice) {
          newSizeMap[size] = {
            id,
            askingPrice,
          };
        } else {
          newSizeMap[size] = {
            id,
            askingPrice,
          };
        }
      } else {
        const currentLowestPrice = usedSizeMap[size];

        if (currentLowestPrice && askingPrice < currentLowestPrice) {
          usedSizeMap[size] = {
            id,
            askingPrice,
          };
        } else {
          usedSizeMap[size] = {
            id,
            askingPrice,
          };
        }
      }
    });

    this.setState(
      {
        newSizeMap,
        usedSizeMap,
      },
      () => console.log(this.state),
    );
  };

  renderAvailableSizes = data => {
    const {
      selectedCondition,
      selectedSize,
      selectedResellItem,
      newSizeMap,
      usedSizeMap,
    } = this.state;

    if (selectedCondition === '') {
      return (
        <div className={Style.sizeMessage}>Select desired condition above.</div>
      );
    }

    const sizeMap = selectedCondition === 'new' ? newSizeMap : usedSizeMap;

    const sizes = Object.keys(sizeMap);

    if (sizes.length === 0) {
      return (
        <div className={Style.sizeMessage}>Sold out / None available.</div>
      );
    }

    let sortedSizes = sizes;

    if (data.productCategory === 'sneakers') {
      sortedSizes = sizes.sort((a, b) => {
        return parseFloat(a) > parseFloat(b) ? 1 : -1;
      });
    }

    return (
      <div className={Style.sizeButtonsContainer}>
        {sortedSizes.map(size => {
          const { id, askingPrice } = sizeMap[size];

          return (
            <div
              className={
                selectedResellItem === id
                  ? cx(Style.sizeButton, Style.active)
                  : Style.sizeButton
              }
              onClick={() =>
                this.setState({
                  selectedResellItem: id,
                })
              }
            >
              {data.productCategory === 'sneakers' ? 'US' : ''} {size}
            </div>
          );
        })}
      </div>
    );
  };

  renderPrice = data => {
    const { selectedResellItem } = this.state;
    const { resellItems } = data;

    const filteredResellItem = resellItems.filter(item => {
      return item.id === selectedResellItem;
    });

    const listing = filteredResellItem[0];

    return `$${listing.askingPrice}`;
  };

  renderDetailedImages = data => {
    const { imageIndex, showDetailedImages, selectedResellItem } = this.state;

    const { resellItems } = data;

    if (!selectedResellItem) {
      return null;
    }

    const filteredResellItems = resellItems.filter(
      resellItem => resellItem.id === selectedResellItem,
    );

    const activeResellItem = filteredResellItems[0];

    const { images } = activeResellItem;

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

  render() {
    console.log(this.props);
    const { currentSlug, listingsMap } = this.props.productListing;
    const data = listingsMap[currentSlug];

    if (data === null || data === undefined) {
      return <LoadingScreen />;
    }

    const likedProducts = this.props.user ? this.props.user.likedProducts : [];
    const isLiked = likedProducts.includes(data.id);

    const {
      brand,
      productCategory,
      name,
      sku,
      colorway,
      designer,
      releaseDate,
      gender,
    } = data;

    const { selectedCondition, selectedResellItem } = this.state;

    return (
      <div className={Style.productBackground}>
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
            </div>
            <div className={Style.conditionContainer}>
              Condition
              <div className={Style.conditionButtonsContainer}>
                <div
                  onClick={() => this.onSelectCondition('new')}
                  className={
                    selectedCondition === 'new'
                      ? cx(Style.conditionButton, Style.active)
                      : Style.conditionButton
                  }
                >
                  New
                </div>
                <div
                  onClick={() => this.onSelectCondition('used')}
                  className={
                    selectedCondition === 'used'
                      ? cx(Style.conditionButton, Style.active)
                      : Style.conditionButton
                  }
                >
                  Used
                </div>
              </div>
            </div>
            <div className={Style.sizeContainer}>
              <div>Select Size</div>
              <div>{this.renderAvailableSizes(data)}</div>
            </div>

            {selectedResellItem && (
              <div className={Style.priceContainer}>
                <div className={Style.price}>{this.renderPrice(data)}</div>
                <div>
                  {selectedResellItem && selectedCondition === 'used' && (
                    <button
                      onClick={() =>
                        this.setState({
                          showDetailedImages: true,
                        })
                      }
                      className={Style.showImageUploads}
                    >
                      Show seller image uploads
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className={Style.buttonsContainer}>
              {!this.state.isCreatingOrder ? (
                <Button
                  className={Style.buyButton}
                  onClick={() => this.onClickBuy()}
                  status={this.buyButtonStatus()}
                >
                  Buy Now
                </Button>
              ) : (
                <div
                  style={{
                    width: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <ClipLoader width={'30px'} color={'#fff'} />
                  <div>Creating order...</div>
                </div>
              )}

              {/* <Button className={Style.myListButton}>
                <FavoriteIcon />
              </Button> */}
              <div className={Style.likeButtonContainer}>
                <button
                  className={
                    isLiked
                      ? cx(Style.likeButton, Style.active)
                      : Style.likeButton
                  }
                  data-tip="Cop or not?"
                  data-for="like"
                  onClick={() => this.onClickLike(data.id)}
                >
                  <FireIcon />
                </button>
                <h4 className={Style.likeButtonCount}>
                  {this.state.numberOfLikes}
                </h4>
              </div>
            </div>
            {this.state.selectedResellItem && (
              <Button
                className={Style.mobileBuyButton}
                onClick={() => this.onClickBuy()}
              >
                {' '}
                Buy Now{' '}
                <span style={{ marginLeft: '10px' }}>
                  {this.renderPrice(data)}
                </span>
              </Button>
            )}
            <div className={Style.errorMessage}>{this.state.error}</div>
          </div>
          <div className={Style.mediaContainer}>
            {this.renderNavigationLinks(brand, name)}
            {this.renderProductImageGallery(data)}
          </div>
        </div>
        <ReactTooltip
          html={true}
          id="like"
          effect="solid"
          multiline={true}
          type="light"
          className={Style.reactTooltip}
        />{' '}
        {this.renderDetailedImages(data)}
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = ProductListingDuck;

  return {
    productListing: state[duckName],
    user: state[UserDuck.duckName].user,
  };
};

export default connect(mapStateToProps)(ProductListingPage);
