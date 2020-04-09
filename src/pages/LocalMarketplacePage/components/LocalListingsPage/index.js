import React, { Component } from 'react';
import algoliasearch from 'algoliasearch';
import { TickIcon } from 'assets/Icons';
import { Rheostat } from 'fields';

import ResellItemTemplate from '../ResellItemTemplate';

import {
  InstantSearch,
  SearchBox,
  connectStats,
  //   Hits,
  connectRefinementList,
  SortBy,
  Pagination,
  Configure,
  connectHits,
  connectRange,
} from 'react-instantsearch-dom';

import { LocationSearchInput } from 'fields';

import Select from 'react-select';

import Style from './style.module.scss';
import cx from 'classnames';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

// Custom Components

function Hits(props) {
  console.log(props.hits);
  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        return <ResellItemTemplate key={hit.objectID} hit={hit} />;
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
          marginBottom: '7px',
        }}
      >
        {attribute}
      </p>
      <div>
        {sortedItems.map(item => {
          return (
            <p
              style={{ fontSize: '12px', cursor: 'pointer' }}
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

const radiusOptions = [
  {
    value: 8046,
    label: 'Within 5 miles',
  },
  {
    value: 16093,
    label: 'Within 10 miles',
  },
  {
    value: 32187,
    label: 'Within 20 miles',
  },
  {
    value: 48280,
    label: 'Within 30 miles',
  },
  {
    value: 80467,
    label: 'Within 50 miles',
  },
  {
    value: 120701,
    label: 'Within 75 miles',
  },
  {
    value: 241402,
    label: 'Within 150 miles',
  },
  {
    value: 321869,
    label: 'Within 200 miles',
  },
];

export default class LocalListingsPage extends Component {
  state = {
    showFilters: false,
    productCategory: 'sneakers',
    selectedRadius: radiusOptions[0],
  };

  render() {
    return (
      <div className={Style.pageContent}>
        <div className={Style.pageTitle}>
          <h1>Local Marketplace</h1>
        </div>
        <div>
          <div>
            <LocationSearchInput
              address={this.props.address}
              latitude={this.props.lat}
              longitude={this.props.lng}
              onSelectLocation={this.props.onSelectLocation}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              marginTop: '20px',
              alignItems: 'center',
            }}
          >
            <div style={{ marginRight: '10px' }}>Radius</div>
            <div className={Style.dropdownRadiusMenu}>
              <Select
                options={radiusOptions}
                value={this.state.selectedRadius}
                onChange={selectedRadius => this.setState({ selectedRadius })}
              />
            </div>
          </div>
        </div>
        <div className={Style.algoliaContentWrapper}>
          <InstantSearch
            indexName="test_LOCAL_LISTINGS"
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
                      {this.state.showFilters ? 'HIDE FILTERS' : 'SHOW FILTERS'}
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
                    defaultRefinement="test_LOCAL_LISTINGS"
                    items={[
                      { value: 'test_LOCAL_LISTINGS', label: 'Featured' },
                      {
                        value: 'test_LOCAL_LISTINGS_ascPrice',
                        label: 'Price asc.',
                      },
                      {
                        value: 'test_LOCAL_LISTINGS_descPrice',
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
                  <CustomRefinementList attribute="productType" operator="or" />
                </div>
                <div>
                  <CustomRefinementList attribute="brand_name" operator="or" />
                </div>
                <div>
                  <CustomRefinementList attribute="condition" operator="or" />
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
                  hitsPerPage={9}
                  filters={`productCategory:${this.state.productCategory}`}
                  distinct={false}
                  aroundLatLng={`${this.props.latitude},${this.props.longitude}`}
                  aroundRadius={this.state.selectedRadius.value}
                  getRankingInfo={true}
                />
              </div>
              <div className={Style.filterResultsArea}>
                <CustomHits className={Style.resultsGrid} />
              </div>
            </div>
            <div className={Style.pagination}>
              <Pagination />
            </div>
          </InstantSearch>
        </div>
      </div>
    );
  }
}
