import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

// Components
import AdminModals from 'components/AdminModals';
import { ListOfOrders } from 'components/AdminComponents/Orders';

// Style
import Style from '../style.module.scss';
import cx from 'classnames';

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from 'functions';
import { SearchIcon, CloseIcon } from 'assets/Icons';

const dateInput = [
  {
    label: '1d',
    id: 'oneDay',
  },
  {
    label: '1w',
    id: 'oneWeek',
  },
  {
    label: '1m',
    id: 'oneMonth',
  },
  {
    label: 'All',
    id: 'allTime',
  },
];

class Orders extends Component {
  confirmNotif = null;

  state = {
    showCreateItemModal: false,
    query: '',
    dateInput: 'allTime',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.query !== this.props.query) {
      this.onRefreshAfterChanges();
      this.setState({
        query: this.props.query,
      });
    }
    if (prevProps.dateInput !== this.props.dateInput) {
      this.onRefreshAfterChanges();
      this.setState({
        dateInput: this.props.dateInput,
      });
    }
  }

  onRefreshAfterChanges = async () => {
    const { query, dateInput } = this.props;
    const { actionCreators } = TestObjectsDuck;
    const { getPurchasedOrders } = actionCreators;
    const { success, message } = await this.props.dispatch(
      getPurchasedOrders(query, dateInput),
    );
    if (success) {
      // this.confirmNotif = ShowConfirmNotif({
      //   message,
      //   type: 'success',
      // });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  onChangeSearchQuery = query => {
    this.setState({
      query,
    });
  };

  onRunSearch = async () => {
    const { query } = this.state;
    if (query === '') {
      return;
    }
    const { changeOrdersQuery } = TestObjectsDuck.actionCreators;
    this.props.dispatch(changeOrdersQuery(query));
  };

  selectDateInput = id => {
    if (this.state.activeDateInputID === id) {
      return;
    }
    const { changeOrdersDateInput } = TestObjectsDuck.actionCreators;
    this.props.dispatch(changeOrdersDateInput(id));
  };

  onRemoveSearch = async () => {
    const { changeOrdersQuery } = TestObjectsDuck.actionCreators;
    this.props.dispatch(changeOrdersQuery(''));
  };

  //  Render Methods
  renderCreateModal = () => (
    <AdminModals.OrdersModal
      onCloseModal={this.onHideCreateItemModal}
      onUpdateAfterResellItemCreated={this.onUpdateAfterResellItemCreated}
    />
  );

  renderDateInput = () => {
    return (
      <React.Fragment>
        {dateInput.map(input => {
          console.log(input);
          return (
            <button
              className={
                this.props.dateInput === input.id
                  ? cx(Style.dateInputButton, Style.active)
                  : Style.dateInputButton
              }
              onClick={() => this.selectDateInput(input.id)}
            >
              {input.label}
            </button>
          );
        })}
      </React.Fragment>
    );
  };

  renderFilterControls = () => {
    const { query } = this.state;

    return (
      <div className={Style.filterControlContainer}>
        <div className={Style.searchInputAndButton}>
          <div className={Style.searchContainer}>
            <label className={Style.searchInputContainer}>
              <input
                className={Style.searchInput}
                maxLength="80"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                placeholder="Search Product, Buyer, Seller ..."
                onChange={e => this.onChangeSearchQuery(e.target.value)}
                value={query}
                autoFocus
              />
            </label>
            <div className={Style.searchInputOverlay}>
              <span className={Style.searchLogo}>
                <SearchIcon />
              </span>
              <button
                className={Style.cancelSearchButton}
                onClick={() => this.onRemoveSearch()}
              >
                <CloseIcon />
              </button>
            </div>
          </div>
          <button
            className={Style.searchButton}
            onClick={() => this.onRunSearch()}
          >
            Search
          </button>
        </div>
        <div className={Style.uploadDateInput}>{this.renderDateInput()}</div>
      </div>
    );
  };

  renderAllOrders = () => (
    <ListOfOrders
      orders={this.props.orders}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingOrders } = this.props;
    if (isFetchingOrders) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ClipLoader color={'#000000'} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.state.showCreateItemModal && this.renderCreateModal()}
        {this.renderFilterControls()}
        {this.renderAllOrders()}
        <div className={Style.floatingButton}>
          <button onClick={this.onShowCreateItemModal}>+</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = TestObjectsDuck;
  return {
    isFetchingOrders: state[duckName].orders.isFetching,
    orders: state[duckName].orders.data,
    query: state[duckName].orders.query,
    dateInput: state[duckName].orders.dateInput,
  };
};

export default connect(mapStateToProps)(Orders);

Orders.propTypes = {
  isFetchingOrders: PropTypes.bool,
  orders: PropTypes.array,
};
