import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';
import { ImageGallery } from 'fields';

import moment from 'moment';

import { connect } from 'react-redux';
import ProductListingDuck from 'stores/ducks/ProductListing.duck';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

import { Img } from 'fields';

class ProductListingPage extends Component {
  state = { viewResellers: false, selectedResellItem: '' };

  async componentDidMount() {
    const { productListingID } = this.props.match.params;
    console.log(productListingID);
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
        const data = listingsMap[currentSlug];
        this.setState({ selectedResellItem: data.resellItems[0] });
      }
    } else {
      console.log(message);
    }
  }

  renderImageGallery = data => {
    let imageGalleryInput = [];

    const { viewResellers } = this.state;
    if (!viewResellers) {
      const { original_image_url, additional_pictures } = data;

      imageGalleryInput.push({
        original: original_image_url,
        thumbnail: original_image_url,
      });
      additional_pictures.map(pictureURL => {
        imageGalleryInput.push({
          original: pictureURL,
          thumbnail: pictureURL,
        });
      });
    } else {
      const { selectedResellItem } = this.state;
      const { images } = selectedResellItem;
      images.map(image => {
        imageGalleryInput.push({
          original: image,
          thumbnail: image,
        });
      });
    }

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

  renderProductFeaturesList = data => {
    const { releaseDate, colorway, nickname, gender } = data;

    return (
      <ul className={Style.featureList}>
        {colorway && (
          <li className={Style.featureListItem}>
            <div className={Style.featureTitle}>colorway</div>
            <div className={Style.featureContent}>{colorway}</div>
          </li>
        )}
        {nickname && (
          <li className={Style.featureListItem}>
            <div className={Style.featureTitle}>nickname</div>
            <div className={Style.featureContent}>{nickname}</div>
          </li>
        )}
        {gender && (
          <li className={Style.featureListItem}>
            <div className={Style.featureTitle}>gender</div>
            <div className={Style.featureContent}>{gender}</div>
          </li>
        )}
        {releaseDate && (
          <li className={Style.featureListItem}>
            <div className={Style.featureTitle}>release Date</div>
            <div className={Style.featureContent}>
              {moment(releaseDate).format('YYYY-MM-DD')}
            </div>
          </li>
        )}
      </ul>
    );
  };

  renderProductDetails = data => {
    return (
      <React.Fragment>
        <div className={Style.detailsContainer}>
          <div className={Style.detailsBlock}>
            <div className={Style.detailsTitle}>Brand</div>
            <div className={Style.detailsContent}>{data.brand.name}</div>
          </div>
          <div className={Style.detailsBlock}>
            <div className={Style.detailsTitle}>Designer</div>
            <div className={Style.detailsContent}>{data.designer.name}</div>
          </div>
          <div className={Style.detailsBlock}>
            <div className={Style.detailsTitle}>SKU</div>
            <div className={Style.detailsContent}>{data.sku}</div>
          </div>
        </div>
        {data.description !== '' && (
          <div className={Style.description}>
            <div className={Style.detailsTitle}>Description</div>
            <p className={Style.productDescription}>{data.description}</p>
          </div>
        )}
        {this.renderProductFeaturesList(data)}
        <button
          className={Style.viewResellersButton}
          onClick={() => {
            this.setState({ viewResellers: true });
          }}
        >
          <span className={Style.buttonText}>View Resellers</span>
        </button>
      </React.Fragment>
    );
  };

  renderResellers = data => {
    const { resellItems } = data;
    if (resellItems.length === 0) {
      return <div>No Resell items found</div>;
    }

    const conditionMap = {
      new: { label: 'New, Deadstock' },
      new_defects: { label: 'New, Defects' },
      new_opened: { label: 'New, Opened' },
      preowned: { label: 'Preowned' },
    };

    return (
      <React.Fragment>
        <button
          className={Style.viewResellersButton}
          onClick={() => {
            this.setState({ viewResellers: false });
          }}
        >
          <span className={Style.buttonText}>Back</span>
        </button>
        <ul className={Style.resellersList}>
          {resellItems.map(resellItem => {
            const { reseller, condition, askingPrice, size } = resellItem;
            const { name, imageURL } = reseller;

            return (
              <li
                className={
                  resellItem.id === this.state.selectedResellItem.id
                    ? cx(Style.resellerListItem, Style.selected)
                    : Style.resellerListItem
                }
                onClick={() =>
                  this.setState({ selectedResellItem: resellItem })
                }
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Img className={Style.resellerImage} src={imageURL} />
                  <div>{name}</div>
                </div>
                <div> {conditionMap[condition].label}</div>
                <div>Size: {size}</div>
                <div>${askingPrice}</div>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  };

  render() {
    console.log(this.props);
    const { currentSlug, listingsMap } = this.props.productListing;
    const data = listingsMap[currentSlug];

    if (data === null || data === undefined) {
      return null;
    }

    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.mediaContainer}>
            {this.renderImageGallery(data)}
          </div>
          <div className={Style.productContainer}>
            <div className={Style.contentContainer}>
              <div className={Style.content}>
                <div className={Style.productName}>{data.name}</div>
                <div style={{ width: '100%' }}>
                  {this.state.viewResellers
                    ? this.renderResellers(data)
                    : this.renderProductDetails(data)}
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
  const { duckName } = ProductListingDuck;

  return {
    productListing: state[duckName],
  };
};

export default connect(mapStateToProps)(ProductListingPage);
