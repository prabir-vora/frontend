import React, { Component } from 'react';
import MainNavBar from 'components/MainNavBar';
import MainFooter from 'components/MainFooter';

import algoliasearch from 'algoliasearch';

import { withRouter } from 'react-router-dom';

import {
  InstantSearch,
  connectHits,
  Pagination,
} from 'react-instantsearch-dom';

import Style from './style.module.scss';

import qs from 'query-string';

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
            <div
              className={Style.gridCellContent}
              onClick={() => props.onClickBrand(name)}
            >
              <div>
                <div className={Style.gridCell}>
                  <div className={Style.gridCellImage}>
                    <img
                      src={imageURL}
                      style={{
                        width: '100px',
                        height: '100px',
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
                      fontSize: '18px',
                      fontWeight: '500',
                      marginTop: '20px',
                      color: '#919496',
                    }}
                  >
                    {name}
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

class BrandsPage extends Component {
  onClickBrand = name => {
    const query = qs.stringify({ brand: name });

    this.props.history.push({ pathname: '/shop', search: query });
  };

  render() {
    return (
      <div
        style={{
          background: 'linear-gradient(100deg, #111010 0%, #4b4b4b 99%)',
        }}
      >
        <MainNavBar />
        <div className={Style.pageLayout}>
          <div className={Style.pageContent}>
            <div className={Style.pageTitle}>
              <h1 className={Style.titleLarge}>Brands</h1>
            </div>
            <div className={Style.algoliaContentWrapper}>
              <InstantSearch
                indexName="test_BRANDS"
                searchClient={searchClient}
              >
                <CustomHits
                  style={{ width: '100%' }}
                  onClickBrand={name => this.onClickBrand(name)}
                />
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

export default withRouter(BrandsPage);
