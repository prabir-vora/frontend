import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainNavBar from 'components/MainNavBar';
import MainFooter from 'components/MainFooter';

import { withRouter } from 'react-router-dom';
import qs from 'query-string';
import algoliasearch from 'algoliasearch';

import Style from './style.module.scss';

import SearchProductTemplate from './components/SearchProductTemplate';
import SearchLocalTemplate from './components/SearchLocalTemplate';
import SeeAllShop from './components/SeeAllShop';
import SeeAllLocal from './components/SeeAllLocal';

import {
  InstantSearch,
  //   SearchBox,
  // connectStats,
  // //   Hits,
  // connectRefinementList,
  // SortBy,
  // Pagination,
  Configure,
  Index,
  connectHits,
} from 'react-instantsearch-dom';
import UserDuck from 'stores/ducks/User.duck';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

function ShopHits(props) {
  if (props.hits.length === 0) {
    return (
      <div className={Style.noResultsContainer}>
        <h1 className={Style.noResultsTitle}>Sorry, no results found</h1>
      </div>
    );
  }

  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        return <SearchProductTemplate key={hit.objectID} hit={hit} />;
      })}
    </div>
  );
}

function LocalHits(props) {
  if (props.hits.length === 0) {
    return (
      <div className={Style.noResultsContainer}>
        <h1 className={Style.noResultsTitle}>Sorry, no results found</h1>
      </div>
    );
  }

  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        return <SearchLocalTemplate key={hit.objectID} hit={hit} />;
      })}
    </div>
  );
}

const CustomProductHits = connectHits(ShopHits);

const CustomLocalHits = connectHits(LocalHits);

class SearchPage extends Component {
  state = { shopHitsCount: 0, localHitsCount: 0 };

  onClickSeeAll = seeAll => {
    const parsed = qs.parse(this.props.location.search);
    console.log(parsed);

    const { searchInput = '' } = parsed;

    if (searchInput === '') {
      return this.props.history.push({ pathname: seeAll });
    }

    console.log(seeAll);

    const query = qs.stringify({ searchInput });

    if (seeAll === 'shop') {
      this.props.history.push({ pathname: '/shop', search: query });
    } else {
      this.props.history.push({ pathname: '/localMarketplace', search: query });
    }
  };

  renderLocalSearchResults = searchInput => {
    if (!this.props.user) {
      return null;
    }
    return (
      <InstantSearch
        indexName="test_LOCAL_LISTINGS"
        searchClient={searchClient}
      >
        <div className={Style.filterResultsArea}>
          <div className={Style.searchContainerHeader}>
            <h2 style={{ marginBottom: '30px' }}>Listings Near you</h2>
            <button
              className={Style.seeAllButton}
              onClick={() => this.onClickSeeAll('localMarketplace')}
            >
              SEE ALL
            </button>
          </div>
          <CustomLocalHits className={Style.resultsGrid} />
        </div>
        <Configure
          query={`${searchInput}`}
          distinct={true}
          hitsPerPage={8}
          distinct={false}
          aroundLatLng={`${this.props.user._geoloc.lat},${this.props.user._geoloc.lng}`}
          aroundRadius={10000}
          getRankingInfo={true}
        />
      </InstantSearch>
    );
  };

  renderSeeAllTitle = (seeAll, searchInput) => {
    switch (seeAll) {
      case 'shop':
        return `Shop results for "${searchInput}"`;
      case 'localMarketplace':
        return `Local Listings for "${searchInput}"`;
      default:
        return '';
    }
  };

  renderSeeAllContent = (seeAll, searchInput) => {
    const { user } = this.props;
    if (seeAll === 'localMarketplace' && user === null) {
      return null;
    }
    console.log(user);
    const { _geoloc, address } = user;
    const { lat, lng } = _geoloc;
    switch (seeAll) {
      case 'shop':
        return <SeeAllShop searchInput={searchInput} />;
      case 'localMarketplace':
        return (
          <SeeAllLocal
            searchInput={searchInput}
            address={address}
            lat={lat}
            lng={lng}
          />
        );
      default:
        return null;
    }
  };

  render() {
    console.log(this.props);
    const parsed = qs.parse(this.props.location.search);
    console.log(parsed);
    const { searchInput = '', seeAll = '' } = parsed;

    if (seeAll !== '') {
      return (
        <div>
          <MainNavBar />
          <div className={Style.pageLayout}>
            <div className={Style.pageContent}>
              <div className={Style.pageTitle}>
                <h1>{this.renderSeeAllTitle(seeAll, searchInput)}</h1>
              </div>
              {this.renderSeeAllContent(seeAll, searchInput)}
            </div>
          </div>
          <MainFooter />
        </div>
      );
    }
    return (
      <div
        style={{
          background:
            'linear-gradient(rgb(136, 131, 128) 0%, rgb(43, 41, 40) 99%)',
          overflowX: 'hidden',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 className={Style.titleLarge}>
                {searchInput === ''
                  ? 'You may like'
                  : `Search Results for "${searchInput}"`}
              </h1>
            </div>
            <InstantSearch
              indexName="test_PRODUCT_LISTINGS"
              searchClient={searchClient}
            >
              <div className={Style.filterResultsArea}>
                <div className={Style.searchContainerHeader}>
                  <h2 className={Style.searchTypeHeader}>Shop</h2>
                  <button
                    className={Style.seeAllButton}
                    onClick={() => this.onClickSeeAll('shop')}
                  >
                    SEE ALL
                  </button>
                </div>
                <CustomProductHits className={Style.resultsGrid} />
              </div>
              <Configure
                query={`${searchInput}`}
                distinct={true}
                hitsPerPage={8}
              />
            </InstantSearch>
            {this.props.user && this.renderLocalSearchResults(searchInput)}
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

const x = withRouter(SearchPage);
export default connect(mapStateToProps)(x);
