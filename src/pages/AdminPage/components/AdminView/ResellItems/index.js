import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

// Components
import AdminModals from 'components/AdminModals';
import { ListOfResellItems } from 'components/AdminComponents/ResellItems';

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

class ResellItems extends Component {
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

  // On Change Actions

  onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

  onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

  onUpdateAfterResellItemCreated = ({ created, message }) => {
    if (created) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });
      this.setState({ showCreateItemModal: false }, () =>
        this.onRefreshAfterChanges(),
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
      this.setState({ showCreateItemModal: false });
    }
  };

  onRefreshAfterChanges = async () => {
    const { query, dateInput } = this.props;
    const { actionCreators } = TestObjectsDuck;
    const { getAllResellItems } = actionCreators;
    const { success, message } = await this.props.dispatch(
      getAllResellItems(query, dateInput),
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
    const { changeResellItemsQuery } = TestObjectsDuck.actionCreators;
    this.props.dispatch(changeResellItemsQuery(query));
  };

  selectDateInput = id => {
    if (this.state.activeDateInputID === id) {
      return;
    }
    const { changeResellItemsDateInput } = TestObjectsDuck.actionCreators;
    this.props.dispatch(changeResellItemsDateInput(id));
  };

  onRemoveSearch = async () => {
    const { query } = this.state;

    const { changeResellItemsQuery } = TestObjectsDuck.actionCreators;
    this.props.dispatch(changeResellItemsQuery(''));
  };

  //  Render Methods
  renderCreateModal = () => (
    <AdminModals.ResellItemsModal
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
                placeholder="Search Product, Brand, Designer, SKU ..."
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

  renderAllResellItems = () => (
    <ListOfResellItems
      resellItems={this.props.resellItems}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingResellItems } = this.props;
    if (isFetchingResellItems) {
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
        {this.renderAllResellItems()}
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
    isFetchingResellItems: state[duckName].resellItems.isFetching,
    resellItems: state[duckName].resellItems.data,
    query: state[duckName].resellItems.query,
    dateInput: state[duckName].resellItems.dateInput,
  };
};

export default connect(mapStateToProps)(ResellItems);

ResellItems.propTypes = {
  isFetchingResellItems: PropTypes.bool,
  resellItems: PropTypes.array,
};
