import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

// Components
import { ListOfUsers } from 'components/AdminComponents/Users';

// Style
import Style from '../style.module.scss';

// Other components
import { ClipLoader } from 'react-spinners';
import { ShowConfirmNotif } from 'functions';

class Users extends Component {
  confirmNotif = null;

  state = {
    showCreateItemModal: false,
  };

  // On Change Actions

  onHideCreateItemModal = () => this.setState({ showCreateItemModal: false });

  onShowCreateItemModal = () => this.setState({ showCreateItemModal: true });

  onUpdateAfterResellerCreated = ({ created, message }) => {
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
    const { getAllUsers } = actionCreators;
    const { success, message } = await this.props.dispatch(getAllUsers());
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

  renderAllUsers = () => (
    <ListOfUsers
      users={this.props.users}
      onRefreshAfterChanges={this.onRefreshAfterChanges}
    />
  );

  render() {
    const { isFetchingUsers } = this.props;
    if (isFetchingUsers) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ClipLoader color={'#000000'} loading={true} />
        </div>
      );
    }
    return (
      <div>
        {this.renderAllUsers()}
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
    isFetchingUsers: state[duckName].users.isFetching,
    users: state[duckName].users.data,
  };
};

export default connect(mapStateToProps)(Users);

Users.propTypes = {
  isFetchingUsers: PropTypes.bool,
  users: PropTypes.array,
};
