import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';
import algoliasearch from 'algoliasearch';
import { ImageGallery } from 'fields';
import { LeftArrowIcon, TickIcon, FireIcon, ShareIcon } from 'assets/Icons';

import AlgoliaListingTemplate from './components/AlgoliaListingTemplate';

import moment from 'moment';

import { connect } from 'react-redux';
import ProductListingDuck from 'stores/ducks/ProductListing.duck';
import AppAuthDuck from 'stores/ducks/AppAuth.duck';
import UserDuck from 'stores/ducks/User.duck';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import {
  InstantSearch,
  connectRefinementList,
  connectHits,
  connectStats,
  Configure,
  SortBy,
} from 'react-instantsearch-dom';

// Style
import Style from './style.module.scss';
import cx from 'classnames';

import { Img } from 'fields';
import MainFooter from 'components/MainFooter';

import ReactTooltip from 'react-tooltip';
import { ShowConfirmNotif } from 'functions';
import LoadingScreen from 'components/LoadingScreen';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

function RefinementListCustom(props) {
  const { attribute } = props;
  switch (attribute) {
    case 'condition':
      return renderConditionRefinementList(props);
    case 'size':
      return renderSizeRefinementList(props);
    default:
      return null;
  }
}

function Hits(props) {
  return (
    <div className={Style.resultsList}>
      {props.hits.map(hit => {
        return <AlgoliaListingTemplate key={hit.objectID} hit={hit} />;
      })}
    </div>
  );
}

function Stats(props) {
  return (
    <p className={Style.stats}>
      {props.nbHits > 1000 ? '1,000+ LISTINGS' : `${props.nbHits} LISTINGS`}
    </p>
  );
}

const CustomRefinementList = connectRefinementList(RefinementListCustom);

const CustomHits = connectHits(Hits);

const CustomStats = connectStats(Stats);

function renderConditionRefinementList(props) {
  const conditionMap = {
    new: { label: 'New, Deadstock', order: 1 },
    new_defects: { label: 'New, Defects', order: 3 },
    new_opened: { label: 'New, Opened', order: 2 },
    preowned: { label: 'Preowned', order: 4 },
  };
  const { attribute, items } = props;

  const sortedItems = items.sort((conditionA, conditionB) => {
    return conditionMap[conditionA.label].order >
      conditionMap[conditionB.label].order
      ? 1
      : -1;
  });
  return (
    <div style={{ marginBottom: '40px' }}>
      <p
        style={{
          textTransform: 'uppercase',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '10px',
        }}
      >
        {attribute}
      </p>
      <div>
        {sortedItems.map(item => {
          return (
            <p
              style={{
                fontSize: '12px',
                cursor: 'pointer',
                marginBottom: '7px',
              }}
              onClick={() => props.refine(item.value)}
            >
              {item.isRefined ? (
                <TickIcon
                  style={{ width: '15px', height: '15px', fill: 'white' }}
                />
              ) : null}{' '}
              {conditionMap[item.label].label}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function renderSizeRefinementList(props) {
  const { items, productCategory } = props;
  console.log(productCategory);

  if (productCategory === 'sneakers') {
    items.sort((sizeA, sizeB) => {
      return parseFloat(sizeA.label) > parseFloat(sizeB.label) ? 1 : -1;
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <p
        style={{
          textTransform: 'uppercase',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '10px',
        }}
      >
        Size
      </p>
      <div>
        {items.map(item => {
          return (
            <p
              style={{
                fontSize: '12px',
                textTransform: 'capitalize',
                cursor: 'pointer',
                marginBottom: '7px',
              }}
              onClick={() => props.refine(item.value)}
            >
              {item.isRefined ? (
                <TickIcon
                  style={{
                    width: '15px',
                    height: '15px',
                    fill: 'white',
                  }}
                />
              ) : null}{' '}
              {item.label}
            </p>
          );
        })}
      </div>
    </div>
  );
}

class ProductListingPage extends Component {
  confirmNotif = null;
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
        const product = listingsMap[currentSlug];
        this.setState({ selectedResellItem: product.resellItems[0], product });
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

  renderImageGallery = data => {
    let imageGalleryInput = [];

    const { original_image_url, additional_pictures } = data;

    imageGalleryInput.push({
      original: original_image_url,
      thumbnail: original_image_url,
    });
    additional_pictures.forEach(pictureURL => {
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
    const { id } = data;
    const likedProducts = this.props.user ? this.props.user.likedProducts : [];
    const isLiked = likedProducts.includes(id);
    const { productListingID } = this.props.match.params;
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
        <div className={Style.buttonContainer}>
          <button
            className={Style.viewResellersButton}
            onClick={() => {
              this.setState({ viewResellers: true });
            }}
          >
            <span className={Style.buttonText}>View Listings</span>
          </button>
          <button
            className={
              isLiked ? cx(Style.likeButton, Style.active) : Style.likeButton
            }
            onClick={() => this.onClickLike(id)}
            data-tip="Like"
          >
            <FireIcon />
          </button>
          <CopyToClipboard
            text={`localhost:3000/shop/${productListingID}`}
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

  renderListings = () => {
    const { user } = this.props;
    const { name, productCategory } = this.state.product;
    let filters;

    filters = user
      ? `name:"${name}" AND (NOT reseller_username:${user.username})`
      : `name:"${name}"`;

    return (
      <React.Fragment>
        <div className={Style.pageTitle}>
          <button
            className={Style.backButton}
            onClick={() => this.setState({ viewResellers: false })}
          >
            <LeftArrowIcon />
            Back
          </button>
          <h1 style={{ color: 'white' }}>{name}</h1>
        </div>
        <InstantSearch
          indexName="test_PRODUCT_LISTINGS"
          searchClient={searchClient}
        >
          <div className={Style.filterSummary}>
            <div className={Style.filterSummaryRowItem}>
              <CustomStats />
            </div>
            <div className={Style.filterSummaryRowItem}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <p
                  style={{
                    margin: '0px 10px',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                  }}
                >
                  Sort By
                </p>
                <SortBy
                  defaultRefinement="test_PRODUCT_LISTINGS"
                  items={[
                    { value: 'test_PRODUCT_LISTINGS', label: 'Featured' },
                    {
                      value: 'test_PRODUCT_LISTINGS_ascPrice',
                      label: 'Price asc.',
                    },
                    {
                      value: 'test_PRODUCT_LISTINGS_descPrice',
                      label: 'Price desc.',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className={Style.listingsContainer}>
            <div className={Style.algoliaWrapper}>
              <div className={Style.filterControls}>
                <div>
                  <CustomRefinementList
                    attribute="size"
                    operator="or"
                    productCategory={productCategory}
                  />
                </div>
                <div>
                  <CustomRefinementList attribute="condition" operator="or" />
                </div>
              </div>
              <div className={Style.filterResultsArea}>
                <CustomHits className={Style.resultsGrid} />
                <Configure hitsPerPage={9} filters={filters} distinct={false} />
              </div>
            </div>
          </div>
        </InstantSearch>
      </React.Fragment>
    );
  };

  render() {
    console.log(this.props);
    const { currentSlug, listingsMap } = this.props.productListing;
    const data = listingsMap[currentSlug];

    if (data === null || data === undefined) {
      return <LoadingScreen />;
    }

    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          {!this.state.viewResellers ? (
            <div style={{ display: 'flex' }}>
              <div className={Style.mediaContainer}>
                {this.renderImageGallery(data)}
              </div>
              <div className={Style.productContainer}>
                <div className={Style.contentContainer}>
                  <div className={Style.content}>
                    <div className={Style.productName}>{data.name}</div>
                    <div style={{ width: '100%' }}>
                      {this.renderProductDetails(data)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={Style.pageContent}>{this.renderListings()}</div>
          )}
        </div>
        <ReactTooltip effect="solid" multiline={true} type="light" />
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
