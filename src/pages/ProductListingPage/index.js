import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';

import ProductImageGallery from './components/ProductImageGallery';

import moment from 'moment';

import { connect } from 'react-redux';
import ProductListingDuck from 'stores/ducks/ProductListing.duck';
import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';
import CheckoutDuck from 'stores/ducks/Checkout.duck';

import { CopyToClipboard } from 'react-copy-to-clipboard';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

import { Button, Img } from 'fields';
import MainFooter from 'components/MainFooter';

import ReactTooltip from 'react-tooltip';
import LoadingScreen from 'components/LoadingScreen';

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
        this.constructSizeMap(product);
      }
    } else {
      console.log(message);
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
      this.props.dispatch(unfollowProduct(productID));
    } else {
      this.props.dispatch(followProduct(productID));
    }
  };

  onClickBuy = async () => {
    const { user } = this.props;

    if (!user) {
      const { actionCreators } = AppAuthDuck;
      const { showModal } = actionCreators;
      return this.props.dispatch(showModal('login'));
    }

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
    } else {
      this.setState({
        error: message,
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

    resellItems.forEach(resellItem => {
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

  renderNavigationLinks = (brand, name) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10px',
      }}
    >
      <a
        style={{
          color: 'grey',
          textTransform: 'uppercase',
          fontSize: '16px',
          marginRight: '10px',
        }}
        href={`/brands/${brand.slug}`}
      >
        {brand.name}
      </a>
      <h5
        style={{
          color: 'grey',
          fontSize: '16px',
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
          fontSize: '16px',
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
              </div>
            )}

            <div className={Style.buttonsContainer}>
              <Button
                className={Style.buyButton}
                onClick={() => this.onClickBuy()}
                status={this.buyButtonStatus()}
              >
                Buy Now
              </Button>
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
