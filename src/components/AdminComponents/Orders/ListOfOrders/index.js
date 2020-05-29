import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

// Style
import Style from './style.module.scss';

// Components
import Order from '../Order';

// Fields
import { PageMsg } from 'fields';

class ListOfOrders extends Component {
  renderOrders = (orders = []) =>
    orders.map(order => {
      const { id } = order;
      return (
        <div className={Style.itemContainer} key={id}>
          <Order
            resellItemID={id}
            order={order}
            onRefreshAfterChanges={this.props.onRefreshAfterChanges}
          />
        </div>
      );
    });

  render() {
    const { orders } = this.props;
    console.log(orders);
    if (Object.keys(orders).length === 0)
      return <PageMsg>No Items Found</PageMsg>;
    return (
      <div
        className={cx(Style.listContainer, this.props.listContainerClassname)}
      >
        {this.renderOrders(orders)}
      </div>
    );
  }
}

export default ListOfOrders;

ListOfOrders.propTypes = {
  orders: PropTypes.array,
  listContainerClassname: PropTypes.string,
  onRefreshAfterChanges: PropTypes.func,
};

ListOfOrders.defaultProps = {
  orders: {},
};
