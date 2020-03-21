import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

// Components
import AdminModals from 'components/AdminModals';
import { ListOfApparel } from 'components/AdminComponents/Apparel';

// Style
import Style from '../style.module.scss';

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from 'functions';

class Apparel extends Component {
  confirmNotif = null;

  state = {
    showCreateItemModal: false,
  };

  // On Change Actions

  onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

  onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

  onUpdateAfterApparelCreated = ({ created, message }) => {
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
    const { actionCreators } = AdminDuck;
    const { getAllApparel } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllApparel());
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
    <AdminModals.ApparelModal
      onCloseModal={this.onHideCreateItemModal}
      onUpdateAfterApparelCreated={this.onUpdateAfterApparelCreated}
    />
  );

  renderAllApparel = () => (
    <ListOfApparel
      apparel={this.props.apparel}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingApparel } = this.props;
    if (isFetchingApparel) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ClipLoader color={'#000000'} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.state.showCreateItemModal && this.renderCreateModal()}
        {this.renderAllApparel()}
        <div className={Style.floatingButton}>
          <button onClick={this.onShowCreateItemModal}>+</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isFetchingApparel: state[duckName].apparel.isFetching,
    apparel: state[duckName].apparel.data,
  };
};

export default connect(mapStateToProps)(Apparel);

Apparel.propTypes = {
  isFetchingApparel: PropTypes.bool,
  apparel: PropTypes.array,
};
