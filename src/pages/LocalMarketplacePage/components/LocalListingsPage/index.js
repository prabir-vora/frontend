import React, { Component } from 'react';
import algoliasearch from 'algoliasearch';
import {
  TickIcon,
  SortAndFilterIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  SearchIcon,
  CloseIcon,
  RadioButtonCheckedIcon,
  RadioButtonUncheckedIcon,
  SortIcon,
} from 'assets/Icons';
import { Rheostat } from 'fields';
import Switch from 'react-switch';

import ResellItemTemplate from '../ResellItemTemplate';

import './pagination.css';

import {
  InstantSearch,
  connectStats,
  //   Hits,
  connectRefinementList,
  connectCurrentRefinements,
  connectSortBy,
  Pagination,
  Configure,
  connectHits,
  connectRange,
} from 'react-instantsearch-dom';

import qs from 'query-string';

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
  if (props.hits.length === 0) {
    return (
      <div className={Style.noResultsContainer}>
        <h1 className={Style.noResultsTitle}>
          Sorry, no results found. Try a different location or change the
          radius.
        </h1>
      </div>
    );
  }
  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        return <ResellItemTemplate key={hit.objectID} hit={hit} />;
      })}
    </div>
  );
}

function Stats(props) {
  if (props.nbHits === 0) {
    return null;
  }
  return (
    <p className={Style.stats}>
      {props.nbHits > 10000
        ? 'Showing 10,000+ pieces'
        : `Showing ${props.nbHits} pieces`}
    </p>
  );
}

function ClearRefinements(props) {
  const { items, refine } = props;
  return (
    <div>
      <button
        className={Style.resetFiltersButtonDesktop}
        onClick={() => refine(items)}
        disabled={!items.length}
      >
        Clear Filters
      </button>
      <button
        className={Style.resetFiltersButtonMobile}
        onClick={() => refine(items)}
        disabled={!items.length}
      >
        Clear All
      </button>
    </div>
  );
}

function SortBy(props) {
  const {
    items,
    currentRefinement,
    refine,
    showSortBy,
    toggleIndividualFilter,
  } = props;
  console.log(props);
  return (
    <div className={Style.sortByContainer}>
      <div className={Style.sortByDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('sortBy')}
        >
          <p className={Style.filterHeading}>Sort By</p>
          <label className={Style.expandButton}>
            {showSortBy ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>

        <div className={showSortBy ? Style.filterList : Style.hideFilterList}>
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainer}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButton}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefault}>{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={Style.sortByMobile}>
        <select
          value={currentRefinement.label}
          onChange={e => {
            console.log(e.target.value);
            props.refine(e.target.value);
          }}
        >
          {items.map(item => {
            return (
              <option value={item.value} className={Style.filterItemContainer}>
                {item.label}
              </option>
            );
          })}
        </select>
        <span className={Style.sortByLabelMobile}>
          <SortIcon />
          Sort By
        </span>
      </div>
    </div>
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
  const {
    attribute,
    items,
    showConditionFilter,
    toggleIndividualFilter,
  } = props;

  const sortedItems = items.sort((conditionA, conditionB) => {
    return conditionMap[conditionA.label].order >
      conditionMap[conditionB.label].order
      ? 1
      : -1;
  });
  return (
    <div>
      <div className={Style.IndividualFilterDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('condition')}
        >
          <p className={Style.filterHeading}>{attribute}</p>
          <label className={Style.expandButton}>
            {showConditionFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>
        <div
          className={
            showConditionFilter ? Style.filterList : Style.hideFilterList
          }
        >
          {sortedItems.map(item => {
            return (
              <div
                className={Style.filterItemContainer}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButton}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefault}>
                  {conditionMap[item.label].label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={Style.IndividualFilterMobile}>
        <div
          className={Style.filterHeadingContainerMobile}
          onClick={() => toggleIndividualFilter('condition')}
        >
          <p className={Style.filterHeadingMobile}>{attribute}</p>
          <label className={Style.expandButtonMobile}>
            {showConditionFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>
        <div
          className={
            showConditionFilter ? Style.filterList : Style.hideFilterList
          }
        >
          {sortedItems.map(item => {
            return (
              <div
                className={Style.filterItemContainerMobile}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButtonMobile}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefaultMobile}>
                  {conditionMap[item.label].label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderBrandRefinementList(props) {
  const {
    items,
    showBrandsFilter,
    toggleIndividualFilter,
    searchForItems,
  } = props;
  return (
    <div>
      <div className={Style.IndividualFilterDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('brands')}
        >
          <p className={Style.filterHeading}>Brands</p>
          <label className={Style.expandButton}>
            {showBrandsFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showBrandsFilter ? Style.filterList : Style.hideFilterList}
        >
          <div className={Style.brandsSearchContainer}>
            <label className={Style.brandsSearchInputContainer}>
              <input
                className={Style.brandsSearchInput}
                maxLength="80"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Search Brands"
                onChange={e => searchForItems(e.target.value)}
                autoFocus
              />
            </label>
            <div className={Style.brandsSearchInputOverlay}>
              <span className={Style.brandsSearchLogo}>
                <SearchIcon />
              </span>
            </div>
          </div>
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainer}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButton}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefault}>{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={Style.IndividualFilterMobile}>
        <div
          className={Style.filterHeadingContainerMobile}
          onClick={() => toggleIndividualFilter('brands')}
        >
          <p className={Style.filterHeadingMobile}>Brands</p>
          <label className={Style.expandButtonMobile}>
            {showBrandsFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showBrandsFilter ? Style.filterList : Style.hideFilterList}
        >
          <div className={Style.brandsSearchContainerMobile}>
            <label className={Style.brandsSearchInputContainer}>
              <input
                className={Style.brandsSearchInput}
                maxLength="80"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Search Brands"
                onChange={e => searchForItems(e.target.value)}
                autoFocus
              />
            </label>
            <div className={Style.brandsSearchInputOverlay}>
              <span className={Style.brandsSearchLogo}>
                <SearchIcon />
              </span>
            </div>
          </div>
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainerMobile}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButtonMobile}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefaultMobile}>
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderGenderRefinementList(props) {
  const { items, showGenderFilter, toggleIndividualFilter } = props;

  const activeFilterList = items.filter(item => item.isRefined);

  const activeFilter =
    activeFilterList.length !== 0 ? activeFilterList[0] : { label: 'All' };

  return (
    <div>
      <div className={Style.IndividualFilterDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('gender')}
        >
          <p className={Style.filterHeading}>
            Gender{' '}
            <span
              className={
                showGenderFilter
                  ? Style.hideFilterLabel
                  : Style.activeFilterLabel
              }
            >
              - {activeFilter.label}
            </span>
          </p>
          <label className={Style.expandButton}>
            {showGenderFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showGenderFilter ? Style.filterList : Style.hideFilterList}
        >
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainer}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButton}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefault}>{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={Style.IndividualFilterMobile}>
        <div
          className={Style.filterHeadingContainerMobile}
          onClick={() => toggleIndividualFilter('gender')}
        >
          <p className={Style.filterHeadingMobile}>
            Gender{' '}
            <span
              className={
                showGenderFilter
                  ? Style.hideFilterLabel
                  : Style.activeFilterLabel
              }
            >
              - {activeFilter.label}
            </span>
          </p>
          <label className={Style.expandButtonMobile}>
            {showGenderFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showGenderFilter ? Style.filterList : Style.hideFilterList}
        >
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainerMobile}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButtonMobile}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefaultMobile}>
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderProductTypeRefinementList(props) {
  const { items, showProductTypeFilter, toggleIndividualFilter } = props;
  console.log(items);

  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <div className={Style.IndividualFilterDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('productType')}
        >
          <p className={Style.filterHeading}>Product Type</p>
          <label className={Style.expandButton}>
            {showProductTypeFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={
            showProductTypeFilter ? Style.filterList : Style.hideFilterList
          }
        >
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainer}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButton}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefault}>{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className={Style.IndividualFilterMobile}>
        <div
          className={Style.filterHeadingContainerMobile}
          onClick={() => toggleIndividualFilter('productType')}
        >
          <p className={Style.filterHeadingMobile}>Product Type</p>
          <label className={Style.expandButtonMobile}>
            {showProductTypeFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={
            showProductTypeFilter ? Style.filterList : Style.hideFilterList
          }
        >
          {items.map(item => {
            return (
              <div
                className={Style.filterItemContainerMobile}
                onClick={() => props.refine(item.value)}
              >
                <label className={Style.filterItemRadioButtonMobile}>
                  {item.isRefined ? (
                    <RadioButtonCheckedIcon />
                  ) : (
                    <RadioButtonUncheckedIcon />
                  )}{' '}
                </label>
                <p className={Style.filterListItemDefaultMobile}>
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function renderSizeRefinementList(props) {
  const {
    items,
    productCategory,
    showSizeFilter,
    toggleIndividualFilter,
  } = props;
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
    <div>
      <div className={Style.IndividualFilterDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('size')}
        >
          <p className={Style.filterHeading}>Size</p>
          <label className={Style.expandButton}>
            {showSizeFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showSizeFilter ? Style.filterList : Style.hideFilterList}
        >
          <div className={Style.sizeFilterListContainer}>
            {items.map(item => {
              return (
                <p
                  className={
                    item.isRefined
                      ? cx(Style.sizeFilterListItem, Style.sizeFilterItemActive)
                      : Style.sizeFilterListItem
                  }
                  onClick={() => props.refine(item.value)}
                >
                  {item.label}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <div className={Style.IndividualFilterMobile}>
        <div
          className={Style.filterHeadingContainerMobile}
          onClick={() => toggleIndividualFilter('size')}
        >
          <p className={Style.filterHeadingMobile}>Size</p>
          <label className={Style.expandButtonMobile}>
            {showSizeFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showSizeFilter ? Style.filterList : Style.hideFilterList}
        >
          <div className={Style.sizeFilterListContainerMobile}>
            {items.map(item => {
              return (
                <p
                  className={
                    item.isRefined
                      ? cx(Style.sizeFilterListItem, Style.sizeFilterItemActive)
                      : Style.sizeFilterListItem
                  }
                  onClick={() => props.refine(item.value)}
                >
                  {item.label}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RangeSlider(props) {
  console.log(props);
  const {
    min,
    max,
    currentRefinement,
    refine,
    showPriceFilter,
    toggleIndividualFilter,
  } = props;

  if (min === max) {
    return null;
  }

  return (
    <div>
      <div className={Style.IndividualFilterDesktop}>
        <div
          className={Style.filterHeadingContainer}
          onClick={() => toggleIndividualFilter('price')}
        >
          <p className={Style.filterHeading}>
            Price{' '}
            <span
              className={
                showPriceFilter
                  ? Style.hideFilterLabel
                  : Style.activeFilterLabel
              }
            >
              - ${currentRefinement.min} to ${currentRefinement.max}
            </span>
          </p>
          <label className={Style.expandButton}>
            {showPriceFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showPriceFilter ? Style.filterList : Style.hideFilterList}
        >
          <Rheostat
            values={[currentRefinement.min, currentRefinement.max]}
            min={min}
            max={max}
            onChange={({ values: [min, max] }) => {
              refine({ min, max });
            }}
          />
        </div>
      </div>
      <div className={Style.IndividualFilterMobile}>
        <div
          className={Style.filterHeadingContainerMobile}
          onClick={() => toggleIndividualFilter('price')}
        >
          <p className={Style.filterHeadingMobile}>
            Price{' '}
            <span
              className={
                showPriceFilter
                  ? Style.hideFilterLabel
                  : Style.activeFilterLabel
              }
            >
              - ${currentRefinement.min} to ${currentRefinement.max}
            </span>
          </p>
          <label className={Style.expandButtonMobile}>
            {showPriceFilter ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </label>
        </div>{' '}
        <div
          className={showPriceFilter ? Style.filterList : Style.hideFilterList}
        >
          <div className={Style.priceSliderContainerMobile}>
            <Rheostat
              values={[currentRefinement.min, currentRefinement.max]}
              min={min}
              max={max}
              onChange={({ values: [min, max] }) => {
                refine({ min, max });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomHits = connectHits(Hits);

const CustomStats = connectStats(Stats);

const CustomRefinementList = connectRefinementList(RefinementListCustom);

const CustomRangeSlider = connectRange(RangeSlider);

const CustomClearRefinements = connectCurrentRefinements(ClearRefinements);

const CustomSortBy = connectSortBy(SortBy);

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
    showSortBy: true,
    showBrandsFilter: false,
    showProductTypeFilter: false,
    showConditionFilter: false,
    showGenderFilter: false,
    showSizeFilter: false,
    showPriceFilter: false,
    productCategory: 'sneakers',
    isUserPresent: false,
    showMobileFilterContainer: false,
  };

  componentDidMount() {
    console.log(this.props);
    const parsed = qs.parse(this.props.location.search);
    const { searchInput = '' } = parsed;

    if (searchInput !== '') {
      this.setState({
        searchInput,
      });
    }
  }

  toggleIndividualFilter = filterType => {
    switch (filterType) {
      case 'sortBy':
        return this.setState({
          showSortBy: !!!this.state.showSortBy,
        });
      case 'brands':
        return this.setState({
          showBrandsFilter: !!!this.state.showBrandsFilter,
        });
      case 'productType':
        return this.setState({
          showProductTypeFilter: !!!this.state.showProductTypeFilter,
        });
      case 'condition':
        return this.setState({
          showConditionFilter: !!!this.state.showConditionFilter,
        });
      case 'gender':
        return this.setState({
          showGenderFilter: !!!this.state.showGenderFilter,
        });
      case 'size':
        return this.setState({
          showSizeFilter: !!!this.state.showSizeFilter,
        });
      case 'price':
        return this.setState({
          showPriceFilter: !!!this.state.showPriceFilter,
        });
      default:
        return;
    }
  };

  render() {
    const { user } = this.props;
    let filters;

    const { searchInput = '' } = this.state;

    filters = user
      ? `productCategory:${this.state.productCategory} AND (NOT reseller_username:${user.username})`
      : `productCategory:${this.state.productCategory}`;

    return (
      <div className={Style.pageContent}>
        {searchInput ? (
          <div className={Style.pageTitle}>
            <h1 className={Style.searchTitle}>
              {`Search Results for "${searchInput}"`}
            </h1>
          </div>
        ) : (
          <div className={Style.pageTitle}>
            <h1 className={Style.titleLarge}>Local Marketplace</h1>
          </div>
        )}
        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
                styles={{
                  // Fixes the overlapping problem of the component
                  menu: provided => ({
                    ...provided,
                    zIndex: 9999,
                    fontFamily: 'Arial',
                    border: '0 !important',
                  }),
                }}
                inputProps={{ readOnly: true }}
                isSearchable={false}
              />
            </div>
          </div>
        </div>
        <div className={Style.algoliaContentWrapper}>
          <InstantSearch
            indexName="test_LOCAL_LISTINGS"
            searchClient={searchClient}
          >
            <div>
              <div className={Style.productToggleAndStatsMobile}>
                <div className={Style.productCategoryToggleMobile}>
                  <label
                    className={Style.productCategoryLabelMobile}
                    onClick={() => {
                      this.setState({ productCategory: 'sneakers' });
                    }}
                  >
                    Sneakers
                  </label>
                  <Switch
                    checked={
                      this.state.productCategory === 'sneakers' ? false : true
                    }
                    onChange={value => {
                      if (value !== true) {
                        this.setState({
                          productCategory: 'sneakers',
                        });
                      } else {
                        this.setState({
                          productCategory: 'apparel',
                        });
                      }
                    }}
                    onColor="#9A8686"
                    onHandleColor="#fff"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                  />
                  <label
                    className={Style.productCategoryLabelMobile}
                    onClick={() => {
                      this.setState({ productCategory: 'apparel' });
                    }}
                  >
                    Apparel
                  </label>
                </div>
                <CustomStats />
              </div>
              <div
                className={
                  this.state.showMobileFilterContainer
                    ? cx(
                        Style.filterContainerOverlay,
                        Style.filterContainerOverlayActive,
                      )
                    : Style.filterContainerOverlay
                }
              >
                <div
                  className={Style.overlayCover}
                  onClick={() =>
                    this.setState({
                      showMobileFilterContainer: false,
                    })
                  }
                />
              </div>
              <div
                className={
                  this.state.showMobileFilterContainer
                    ? cx(Style.filterContainer, Style.filterContainerActive)
                    : Style.filterContainer
                }
              >
                <div className={Style.filterContainerHeader}>
                  <div
                    className={Style.filterCloseButton}
                    onClick={() =>
                      this.setState({
                        showMobileFilterContainer: false,
                      })
                    }
                  >
                    Back
                  </div>
                  <h2 className={Style.filterContainerTitle}>Filters</h2>
                  <div>
                    <CustomClearRefinements />
                  </div>
                </div>
                <div>
                  <CustomRefinementList
                    attribute="productType"
                    operator="or"
                    showProductTypeFilter={this.state.showProductTypeFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="brand_name"
                    operator="or"
                    showBrandsFilter={this.state.showBrandsFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                    searchable={true}
                    limit={20}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="condition"
                    operator="or"
                    showConditionFilter={this.state.showConditionFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="gender"
                    operator="or"
                    showGenderFilter={this.state.showGenderFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="size"
                    operator="or"
                    productCategory={this.state.productCategory}
                    showSizeFilter={this.state.showSizeFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <CustomRangeSlider
                    attribute="askingPrice"
                    showPriceFilter={this.state.showPriceFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
              </div>
            </div>

            <div className={Style.mobileSortAndFilter}>
              <div className={Style.mobileSortAndFilterButtonsContainer}>
                <div className={Style.sortByInput}>
                  <CustomSortBy
                    defaultRefinement="test_LOCAL_LISTINGS"
                    items={[
                      { value: 'test_LOCAL_LISTINGS', label: 'Featured' },
                      {
                        value: 'test_LOCAL_LISTINGS_ascPrice',
                        label: 'Price: Low to High',
                      },
                      {
                        value: 'test_LOCAL_LISTINGS_descPrice',
                        label: 'Price: High to Low',
                      },
                    ]}
                  />
                </div>
                <span className={Style.sortAndFilterSeperator} />
                <button
                  className={Style.filterButtonMobile}
                  onClick={() =>
                    this.setState({
                      showMobileFilterContainer: true,
                    })
                  }
                >
                  <SortAndFilterIcon /> Filter
                </button>
              </div>
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
                    <SortAndFilterIcon />
                    <span className={Style.toggleName}>Sort and Filter</span>
                  </label>
                </div>
              </div>
              <div className={Style.filterSummaryRowItem}>
                <CustomStats />
              </div>
              <div className={Style.filterSummaryRowItem}>
                <div className={Style.productCategoryToggle}>
                  <label
                    className={Style.productCategoryLabel}
                    onClick={() => {
                      this.setState({ productCategory: 'sneakers' });
                    }}
                  >
                    Sneakers
                  </label>
                  <Switch
                    checked={
                      this.state.productCategory === 'sneakers' ? false : true
                    }
                    onChange={value => {
                      if (value !== true) {
                        this.setState({
                          productCategory: 'sneakers',
                        });
                      } else {
                        this.setState({
                          productCategory: 'apparel',
                        });
                      }
                    }}
                    onColor="#9A8686"
                    onHandleColor="#fff"
                    handleDiameter={30}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 5px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={48}
                    className="react-switch"
                    id="material-switch"
                  />
                  <label
                    className={Style.productCategoryLabel}
                    onClick={() => {
                      this.setState({ productCategory: 'apparel' });
                    }}
                  >
                    Apparel
                  </label>
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
                <div>
                  <CustomClearRefinements />
                </div>
                <div>
                  <CustomSortBy
                    defaultRefinement="test_LOCAL_LISTINGS"
                    items={[
                      { value: 'test_LOCAL_LISTINGS', label: 'Featured' },
                      {
                        value: 'test_LOCAL_LISTINGS_ascPrice',
                        label: 'Price: Low to High',
                      },
                      {
                        value: 'test_LOCAL_LISTINGS_descPrice',
                        label: 'Price: High to Low',
                      },
                    ]}
                    showSortBy={this.state.showSortBy}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="productType"
                    operator="or"
                    showProductTypeFilter={this.state.showProductTypeFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="brand_name"
                    operator="or"
                    showBrandsFilter={this.state.showBrandsFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                    searchable={true}
                    limit={20}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="condition"
                    operator="or"
                    showConditionFilter={this.state.showConditionFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="gender"
                    operator="or"
                    showGenderFilter={this.state.showGenderFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div>
                  <CustomRefinementList
                    attribute="size"
                    operator="or"
                    productCategory={this.state.productCategory}
                    showSizeFilter={this.state.showSizeFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <div style={{ width: '100%' }}>
                  <CustomRangeSlider
                    attribute="askingPrice"
                    showPriceFilter={this.state.showPriceFilter}
                    toggleIndividualFilter={this.toggleIndividualFilter}
                  />
                </div>
                <Configure
                  hitsPerPage={9}
                  filters={filters}
                  distinct={false}
                  aroundLatLng={`${this.props.latitude},${this.props.longitude}`}
                  aroundRadius={this.state.selectedRadius.value}
                  getRankingInfo={true}
                  query={`${searchInput}`}
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
    );
  }
}
