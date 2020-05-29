import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

// Components
import { CenterModal, ModalBackButton } from 'fields';
import UserFormFields from './userFormFields';
import ConfirmArchiveModal from '../ConfirmArchiveModal';

// Style
import ModalStyle from '../style.module.scss';

class UsersModal extends Component {
  state = {
    showLoadingModal: false,
    // All the other fields to be taken in
  };

  componentDidMount() {
    console.log(this.props);
  }

  componentWillUnmount = () => this.setState({ showLoadingModal: false });

  // On Change Methods

  onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false });

  onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true });

  renderModalTitle = () => {
    return <h1>{this.props.isInEditMode ? 'Edit' : 'Create'} User</h1>;
  };

  onSubmitUserInfo = async resellerInfo => {
    const { actionCreators } = TestObjectsDuck;
    const { updateExistingUser } = actionCreators;
    const res = await this.props.dispatch(updateExistingUser(resellerInfo));
    this.props.onUpdateAfterUserSaved(res);
  };

  onArchiveUser = async () => {
    const { actionCreators } = TestObjectsDuck;
    const { removeExistingUser } = actionCreators;
    const res = await this.props.dispatch(
      removeExistingUser(this.props.resellerInfo),
    );
    this.props.onUpdateAfterUserArchived(res);
  };

  // Render methods
  renderArchiveItemButton = () => {
    return (
      <button
        className={ModalStyle.archiveButton}
        name="Archive Item"
        onClick={() => {
          this.onShowConfirmArchiveModal();
        }}
        type="submit"
      >
        Archive
      </button>
    );
  };

  render() {
    const { isInEditMode, resellerInfo } = this.props;
    const { showConfirmArchiveModal } = this.state;
    return (
      <CenterModal
        closeModalButtonLabel={<ModalBackButton />}
        contentLabel="Create or edit item modal"
        modalBoxClassname={ModalStyle.largeCenterModalBox}
        contentContainerClassname={ModalStyle.largeCenterModalContainer}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        {showConfirmArchiveModal && (
          <ConfirmArchiveModal
            name={resellerInfo.name}
            onArchive={() => this.onArchiveUser()}
            onCloseModal={this.onHideConfirmArchiveModal}
          />
        )}
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        <UserFormFields
          isInEditMode={isInEditMode}
          resellerInfo={resellerInfo}
          onSubmit={this.onSubmitUserInfo}
        />
        {isInEditMode && this.renderArchiveItemButton()}
      </CenterModal>
    );
  }
}

UsersModal.propTypes = {
  isInEditMode: PropTypes.bool,
  isMutating: PropTypes.bool,
  resellerInfo: PropTypes.object,
  brandID: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateAfterUserArchived: PropTypes.func,
  onUpdateAfterUserCreated: PropTypes.func,
  onUpdateAfterUserSaved: PropTypes.func,
};

UsersModal.defaultProps = {
  resellerInfo: {
    name: '',
  },
  isInEditMode: true,
};

const mapStateToProps = state => {
  const { duckName } = TestObjectsDuck;
  return {
    isMutating: state[duckName].users.isMutating,
  };
};

export default connect(mapStateToProps)(UsersModal);
