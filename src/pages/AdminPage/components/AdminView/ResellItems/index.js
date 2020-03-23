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

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from 'functions';

class ResellItems extends Component {
  confirmNotif = null;

  state = {
    showCreateItemModal: false,
  };

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
    const { actionCreators } = TestObjectsDuck;
    const { getAllResellItems } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllResellItems());
    if (success) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  //  Render Methods
  renderCreateModal = () => (
    <AdminModals.ResellItemsModal
      onCloseModal={this.onHideCreateItemModal}
      onUpdateAfterResellItemCreated={this.onUpdateAfterResellItemCreated}
    />
  );

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
  };
};

export default connect(mapStateToProps)(ResellItems);

ResellItems.propTypes = {
  isFetchingResellItems: PropTypes.bool,
  resellItems: PropTypes.array,
};
