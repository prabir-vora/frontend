import React, { Component } from 'react';
import { connect } from 'react-redux';
import UserDuck from 'stores/ducks/User.duck';

import algoliasearch from 'algoliasearch';
import MainNavBar from 'components/MainNavBar';
import { TickIcon } from 'assets/Icons';
import { Rheostat } from 'fields';
import './pagination.css';
import { withCookies } from 'react-cookie';

import {
  InstantSearch,
  connectStats,
  //   Hits,
  connectRefinementList,
  SortBy,
  Pagination,
  Configure,
  connectHits,
  connectRange,
} from 'react-instantsearch-dom';

import Style from './style.module.scss';
import cx from 'classnames';

import { AlgoliaProduceTemplate } from './components';
import MainFooter from 'components/MainFooter';
import LoadingScreen from 'components/LoadingScreen';
import ReactTooltip from 'react-tooltip';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

// Custom Components

function Hits(props) {
  console.log(props);
  if (props.hits.length === 0) {
    return null;
  }
  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        return <AlgoliaProduceTemplate key={hit.objectID} hit={hit} />;
      })}
    </div>
  );
}

function Stats(props) {
  return (
    <p className={Style.stats}>
      {props.nbHits > 10000
        ? 'SHOWING 10,000+ RESULTS'
        : `SHOWING ${props.nbHits} RESULTS`}
    </p>
  );
}

function RefinementListCustom(props) {
  const { attribute } = props;
  switch (attribute) {
    case 'brand_name':
      return renderBrandRefinementList(props);
    case 'condition':
      return renderConditionRefinementList(props);
    case 'gender':
      return renderGenderRefinementList(props);
    case 'productType':
      return renderProductTypeRefinementList(props);
    case 'size':
      return renderSizeRefinementList(props);
    default:
      return null;
  }
}

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

function renderBrandRefinementList(props) {
  const { items } = props;
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
        Brands
      </p>
      <div>
        {items.map(item => {
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
              {item.label}
            </p>
          );
        })}
      </div>
    </div>
  );
}

function renderGenderRefinementList(props) {
  const { items } = props;
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
        Gender
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

function renderProductTypeRefinementList(props) {
  const { items } = props;
  console.log(items);

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
        Product Type
      </p>
      <div>
        {items.map(item => {
          return (
            <p
              style={{
                fontSize: '12px',
                textTransform: 'capitalize',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
              onClick={() => props.refine(item.value)}
            >
              {item.isRefined ? (
                <TickIcon
                  style={{
                    width: '15px',
                    height: '15px',
                    fill: 'white',
                    marginBottom: '7px',
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

function RangeSlider(props) {
  console.log(props);
  const { min, max, currentRefinement, refine } = props;

  return (
    <div>
      <p
        style={{
          textTransform: 'uppercase',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '10px',
        }}
      >
        PRICE
      </p>
      <Rheostat
        values={[currentRefinement.min, currentRefinement.max]}
        min={min}
        max={max}
        onChange={({ values: [min, max] }) => {
          refine({ min, max });
        }}
      />
    </div>
  );
}

const CustomHits = connectHits(Hits);

const CustomStats = connectStats(Stats);

const CustomRefinementList = connectRefinementList(RefinementListCustom);

const CustomRangeSlider = connectRange(RangeSlider);

class ShopPage extends Component {
  state = {
    showFilters: false,
    productCategory: 'sneakers',
    isUserPresent: false,
  };

  componentDidMount() {
    const jwt = this.props.cookies.get('jwt');
    if (jwt) {
      this.setState({ isUserPresent: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    ReactTooltip.rebuild();

    const jwt = this.props.cookies.get('jwt');
    if (jwt && !prevState.isUserPresent) {
      this.setState({ isUserPresent: true });
    }

    if (!jwt && prevState.isUserPresent) {
      this.setState({ isUserPresent: false });
    }
  }
  render() {
    const { user } = this.props;

    if (this.state.isUserPresent && !user) {
      return <LoadingScreen />;
    }

    let filters;

    filters = user
      ? `productCategory:${this.state.productCategory} AND (NOT reseller_username:${user.username})`
      : `productCategory:${this.state.productCategory}`;

    return (
      <div style={{ backgroundColor: 'black' }}>
        <ReactTooltip
          html={true}
          id="like"
          effect="solid"
          multiline={true}
          type="light"
        />

        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1>Shop All</h1>
            </div>
            <div className={Style.algoliaContentWrapper}>
              <InstantSearch
                indexName="test_PRODUCT_LISTINGS"
                searchClient={searchClient}
              >
                <div className={Style.productCategoryToggle}>
                  <button
                    className={
                      this.state.productCategory === 'sneakers'
                        ? cx(
                            Style.productCategoryButton,
                            Style.activeProductCategory,
                          )
                        : Style.productCategoryButton
                    }
                    onClick={() => {
                      this.setState({ productCategory: 'sneakers' });
                    }}
                  >
                    Sneakers
                  </button>
                  <button
                    className={
                      this.state.productCategory === 'apparel'
                        ? cx(
                            Style.productCategoryButton,
                            Style.activeProductCategory,
                          )
                        : Style.productCategoryButton
                    }
                    onClick={() => {
                      this.setState({ productCategory: 'apparel' });
                    }}
                  >
                    Apparel
                  </button>
                </div>
                <div className={Style.filterSummary}>
                  <div className={Style.filterSummaryRowItem}>
                    <div className={Style.flexRow}>
                      <label
                        className={Style.collapseToggle}
                        onClick={() =>
                          this.setState({
                            showFilters: !this.state.showFilters,
                          })
                        }
                      >
                        <span className={Style.toggleName}>
                          {this.state.showFilters
                            ? 'HIDE FILTERS'
                            : 'SHOW FILTERS'}
                        </span>
                      </label>
                    </div>
                  </div>
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
                <div className={Style.filterContentArea}>
                  <div
                    className={
                      this.state.showFilters
                        ? cx(Style.filterControls, Style.open)
                        : Style.filterControls
                    }
                  >
                    {/* <ClearRefinements /> */}
                    <div>
                      <CustomRefinementList
                        attribute="productType"
                        operator="or"
                      />
                    </div>
                    <div>
                      <CustomRefinementList
                        attribute="brand_name"
                        operator="or"
                      />
                    </div>
                    <div>
                      <CustomRefinementList
                        attribute="condition"
                        operator="or"
                      />
                    </div>
                    <div>
                      <CustomRefinementList attribute="gender" operator="or" />
                    </div>
                    <div>
                      <CustomRefinementList
                        attribute="size"
                        operator="or"
                        productCategory={this.state.productCategory}
                      />
                    </div>
                    <div style={{ width: '100%' }}>
                      <CustomRangeSlider attribute="askingPrice" />
                    </div>
                    <Configure
                      hitsPerPage={8}
                      filters={filters}
                      distinct={true}
                    />
                  </div>
                  <div className={Style.filterResultsArea}>
                    <CustomHits className={Style.resultsGrid} />
                  </div>
                </div>
                <div className={Style.pagination}>
                  <Pagination
                    padding={2}
                    showFirst={false}
                    showLast={false}
                    translations={{
                      previous: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.143"
                          >
                            <path d="M9 5H1M5 9L1 5l4-4" />
                          </g>
                        </svg>
                      ),
                      next: (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                        >
                          <g
                            fill="none"
                            fillRule="evenodd"
                            stroke="#fff"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.143"
                          >
                            <path d="M1 5h8M5 9l4-4-4-4" />
                          </g>
                        </svg>
                      ),
                    }}
                  />{' '}
                </div>
              </InstantSearch>
            </div>
          </div>
        </div>
        <MainFooter />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state[UserDuck.duckName].user,
  };
};

const x = withCookies(ShopPage);
export default connect(mapStateToProps)(x);
