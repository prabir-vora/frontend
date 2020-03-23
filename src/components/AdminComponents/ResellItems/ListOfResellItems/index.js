import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// Style
import Style from './style.module.scss';

// Components
import ResellItem from '../ResellItem';

// Fields
import { PageMsg } from 'fields';

class ListOfResellItems extends Component {
  renderResellItems = (resellItems = []) =>
    resellItems.map(resellItemInfo => {
      const { id } = resellItemInfo;
      return (
        <div className={Style.itemContainer} key={id}>
          <ResellItem
            resellItemID={id}
            resellItemInfo={resellItemInfo}
            onRefreshAfterChanges={this.props.onRefreshAfterChanges}
          />
        </div>
      );
    });

  render() {
    const { resellItems } = this.props;
    console.log(resellItems);
    if (Object.keys(resellItems).length === 0)
      return <PageMsg>No Items Found</PageMsg>;
    return (
      <div
        className={cx(Style.listContainer, this.props.listContainerClassname)}
      >
        {this.renderResellItems(resellItems)}
      </div>
    );
  }
}

export default ListOfResellItems;

ListOfResellItems.propTypes = {
  resellItems: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func,
};

ListOfResellItems.defaultProps = {
  resellItems: {},
};
