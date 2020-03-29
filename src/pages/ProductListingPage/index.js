import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';

import moment from 'moment';

import { connect } from 'react-redux';
import ProductListingDuck from 'stores/ducks/ProductListing.duck';

// Style
import Style from './style.module.scss';

class ProductListingPage extends Component {
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
    } else {
      console.log(message);
    }
  }

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

  render() {
    console.log(this.props);
    const { currentSlug, listingsMap, error } = this.props.productListing;
    const data = listingsMap[currentSlug];

    if (data === null || data === undefined) {
      return null;
    }

    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.mediaContainer}>Hello</div>
          <div className={Style.productContainer}>
            <div className={Style.contentContainer}>
              <div className={Style.content}>
                <div className={Style.productName}>{data.name}</div>
                <div className={Style.detailsContainer}>
                  <div className={Style.detailsBlock}>
                    <div className={Style.detailsTitle}>Brand</div>
                    <div className={Style.detailsContent}>
                      {data.brand.name}
                    </div>
                  </div>
                  <div className={Style.detailsBlock}>
                    <div className={Style.detailsTitle}>Designer</div>
                    <div className={Style.detailsContent}>
                      {data.designer.name}
                    </div>
                  </div>
                  <div className={Style.detailsBlock}>
                    <div className={Style.detailsTitle}>SKU</div>
                    <div className={Style.detailsContent}>{data.sku}</div>
                  </div>
                </div>
                {data.description !== '' && (
                  <div className={Style.description}>
                    <div className={Style.detailsTitle}>Description</div>
                    <p className={Style.productDescription}>
                      {data.description}
                    </p>
                  </div>
                )}
                {this.renderProductFeaturesList(data)}
                <button className={Style.viewResellersButton}>
                  <span className={Style.buttonText}>View Resellers</span>
                </button>
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
