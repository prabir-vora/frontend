import React, { Component } from 'react';

import MainNavBar from 'components/MainNavBar';

import Style from './style.module.scss';

import algoliasearch from 'algoliasearch';

import { InstantSearch, connectHits } from 'react-instantsearch-dom';

import AlgoliaResellerTemplate from './components/AlgoliaResellerTemplate';
import MainFooter from 'components/MainFooter';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

function Hits(props) {
  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        return <AlgoliaResellerTemplate key={hit.objectID} hit={hit} />;
      })}
    </div>
  );
}

const CustomHits = connectHits(Hits);

class ResellerListPage extends Component {
  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1>Browse Resellers</h1>
            </div>
            <div className={Style.algoliaContentWrapper}>
              <InstantSearch
                indexName="test_RESELLERS"
                searchClient={searchClient}
              >
                <div className={Style.filterResultsArea}>
                  <CustomHits className={Style.resultsGrid} />
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

export default ResellerListPage;
