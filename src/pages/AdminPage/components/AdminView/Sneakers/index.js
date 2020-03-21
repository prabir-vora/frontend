import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

// Components
import AdminModals from 'components/AdminModals';
import { ListOfSneakers } from 'components/AdminComponents/Sneakers';

// Style
import Style from '../style.module.scss';

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from 'functions';

class Sneakers extends Component {
  confirmNotif = null;

  state = {
    showCreateItemModal: false,
  };

  // On Change Actions

  onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

  onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

  onUpdateAfterSneakerCreated = ({ created, message }) => {
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
    const { getAllSneakers } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllSneakers());
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
    <AdminModals.SneakersModal
      onCloseModal={this.onHideCreateItemModal}
      onUpdateAfterSneakerCreated={this.onUpdateAfterSneakerCreated}
    />
  );

  renderAllSneakers = () => (
    <ListOfSneakers
      sneakers={this.props.sneakers}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingSneakers } = this.props;
    if (isFetchingSneakers) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ClipLoader color={'#000000'} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.state.showCreateItemModal && this.renderCreateModal()}
        {this.renderAllSneakers()}
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
    isFetchingSneakers: state[duckName].sneakers.isFetching,
    sneakers: state[duckName].sneakers.data,
  };
};

export default connect(mapStateToProps)(Sneakers);

Sneakers.propTypes = {
  isFetchingSneakers: PropTypes.bool,
  sneakers: PropTypes.array,
};
