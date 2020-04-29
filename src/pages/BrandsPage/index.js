import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';
import MainFooter from 'components/MainFooter';

import algoliasearch from 'algoliasearch';

import {
  InstantSearch,
  connectHits,
  Pagination,
} from 'react-instantsearch-dom';

import Style from './style.module.scss';

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

function Hits(props) {
  console.log(props);
  return (
    <div className={Style.resultsGrid}>
      {props.hits.map(hit => {
        const { _id, imageURL, name, slug } = hit;
        return (
          <div className={Style.gridCellWrapper}>
            <div className={Style.gridCellContent}>
              <div>
                <div className={Style.gridCell}>
                  <div className={Style.gridCellImage}>
                    <img
                      src={imageURL}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        border: '1px solid #cfcaca',
                        objectFit: 'contain',
                        background: 'white',
                      }}
                      alt="not found"
                    />
                  </div>
                  <div
                    style={{
                      textAlign: 'center',
                      fontFamily:
                        'Druk Wide Web,futura-pt,HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica,Arial,Lucida Grande,sans-serif',

                      fontSize: '13px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      marginTop: '20px',
                    }}
                  >
                    <a title={name} href={`/brands/${slug}`}>
                      {name}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const CustomHits = connectHits(Hits);

export default class BrandsPage extends Component {
  render() {
    return (
      <div>
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1>Brands</h1>
            </div>
            <div className={Style.algoliaContentWrapper}>
              <InstantSearch
                indexName="test_BRANDS"
                searchClient={searchClient}
              >
                <CustomHits style={{ width: '100%' }} />
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
