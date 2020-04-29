import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ShopListTemplate from './components/ShopListTemplate';
import ShopGridTemplate from './components/ShopGridTemplate';

import { GridViewIcon, ListViewIcon } from 'assets/Icons';
import ReactTooltip from 'react-tooltip';

import Style from './style.module.scss';
import cx from 'classnames';

class MyShopList extends Component {
  state = { viewType: 'gridView' };

  onChangeViewType = selectedViewType => {
    const { viewType } = this.state;
    if (viewType !== selectedViewType) {
      this.setState({
        viewType: selectedViewType,
      });
    }
  };

  goToShop = () => {
    this.props.history.push('/shop');
  };
  render() {
    const { viewType } = this.state;

    return (
      <React.Fragment>
        <ReactTooltip effect="solid" multiline={true} type="light" />
        <div className={Style.filterSummary}>
          <div className={Style.filterSummaryRowItem}>
            <div className={Style.viewTypeSelectionContainer}>
              <button
                data-tip="Grid View"
                className={
                  viewType === 'gridView'
                    ? cx(Style.viewTypeButton, Style.active)
                    : Style.viewTypeButton
                }
                onClick={() => this.onChangeViewType('gridView')}
              >
                <GridViewIcon />
              </button>
              <button
                data-tip="List View"
                className={
                  viewType === 'listView'
                    ? cx(Style.viewTypeButton, Style.active)
                    : Style.viewTypeButton
                }
                onClick={() => this.onChangeViewType('listView')}
              >
                <ListViewIcon />
              </button>
            </div>
          </div>
        </div>
        <div>
          {this.props.listings.length === 0 && (
            <div className={Style.noResults}>
              <h3>No saved listings.</h3>
              <button
                className={Style.pillButton}
                onClick={() => this.goToShop()}
              >
                Go to Shop
              </button>
            </div>
          )}
        </div>
        <div
          className={viewType === 'gridView' ? Style.gridView : Style.listView}
        >
          {this.props.listings.map(listing => {
            return (
              <React.Fragment>
                {viewType === 'gridView' ? (
                  <ShopGridTemplate key={listing.id} listing={listing} />
                ) : (
                  <ShopListTemplate key={listing.id} listing={listing} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(MyShopList);
