import React, { Component } from 'react';

import algoliasearch from 'algoliasearch';

import {
  InstantSearch,
  //   SearchBox,
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

const searchClient = algoliasearch(
  'UYWEM6FQPE',
  '3b918f48b5c7755f15435a3c749c9bbe',
);

// Custom Components

function Hits(props) {
  console.log(props);
  return (
    <React.Fragment>
      {props.hits.map(hit => {
        const { name, _id, imageURL } = hit;
        return (
          <div
            style={{ marginRight: '20px', marginBottom: '20px' }}
            key={_id}
            onClick={() => {
              props.onSelectBrand(_id);
            }}
          >
            <div className={Style.imageContainer}>
              <img
                src={imageURL}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  border: '1px solid #cfcaca',
                  objectFit: 'contain',
                }}
              />
              {props.selectedBrands.includes(_id) && (
                <div className={Style.after}></div>
              )}
            </div>
          </div>
        );
      })}
    </React.Fragment>
  );
}

const CustomHits = connectHits(Hits);

export default class BrandSelection extends Component {
  state = { selectedBrands: [] };

  onSelectBrand = selectedBrand => {
    const { selectedBrands } = this.state;
    if (selectedBrands.includes(selectedBrand)) {
      const filteredBrands = selectedBrands.filter(brand => {
        return brand !== selectedBrand;
      });

      this.setState(
        {
          selectedBrands: filteredBrands,
        },
        this.props.onBrandSelection(filteredBrands),
      );
    } else {
      selectedBrands.push(selectedBrand);
      this.setState(
        {
          selectedBrands,
        },
        this.props.onBrandSelection(selectedBrands),
      );
    }
  };

  renderSelectionField = brand => {
    const { name, id, imageURL } = brand;
    return (
      <div
        style={{ marginRight: '20px', marginBottom: '20px' }}
        onClick={() => {}}
      >
        <div
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
          }}
        >
          <img
            src={imageURL}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '1px solid #cfcaca',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
    );
  };

  render() {
    const { brands } = this.props;

    return (
      <div style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
        <InstantSearch indexName="test_BRANDS" searchClient={searchClient}>
          <CustomHits
            style={{ width: '100%' }}
            selectedBrands={this.state.selectedBrands}
            onSelectBrand={this.onSelectBrand}
          />
          {/* {brands.map(this.renderSelectionField)} */}
        </InstantSearch>
      </div>
    );
  }
}
