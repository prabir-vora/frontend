import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

// Components
import { CenterModal, ModalBackButton } from 'fields';
import ResellItemFormFields from './resellItemFormFields';
import ConfirmArchiveModal from '../ConfirmArchiveModal';

// Style
import ModalStyle from '../style.module.scss';

class ResellItemsModal extends Component {
  state = {
    showLoadingModal: false,
    // All the other fields to be taken in
  };

  componentWillUnmount = () => this.setState({ showLoadingModal: false });

  // On Change Methods

  onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false });

  onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true });

  renderModalTitle = () => {
    return <h1>{this.props.isInEditMode ? 'Edit' : 'New'} Resell Item</h1>;
  };

  onSubmitResellItemInfo = async resellItemInfo => {
    if (this.props.isInEditMode) {
      const { actionCreators } = TestObjectsDuck;
      const { updateExistingResellItem } = actionCreators;
      const res = await this.props.dispatch(
        updateExistingResellItem(resellItemInfo),
      );
      this.props.onUpdateAfterResellItemSaved(res);
    } else {
      const { actionCreators } = TestObjectsDuck;
      const { createNewResellItem } = actionCreators;
      const res = await this.props.dispatch(
        createNewResellItem(resellItemInfo),
      );
      this.props.onUpdateAfterResellItemCreated(res);
    }
  };

  onArchiveResellItem = async () => {
    const { actionCreators } = TestObjectsDuck;
    const { removeExistingResellItem } = actionCreators;
    const res = await this.props.dispatch(
      removeExistingResellItem(this.props.resellItemInfo),
    );
    this.props.onUpdateAfterResellItemArchived(res);
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
    const { isInEditMode, resellItemInfo } = this.props;
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
            name={resellItemInfo.product.label}
            onArchive={() => this.onArchiveResellItem()}
            onCloseModal={this.onHideConfirmArchiveModal}
          />
        )}
        {this.state.showLoadingModal && <div>Loading...</div>}
        {this.renderModalTitle()}
        <ResellItemFormFields
          isInEditMode={isInEditMode}
          resellItemInfo={resellItemInfo}
          onSubmit={this.onSubmitResellItemInfo}
          sneakers={this.props.sneakers}
          apparel={this.props.apparel}
          resellers={this.props.resellers}
          sizing={this.props.sizing}
        />
        {isInEditMode && this.renderArchiveItemButton()}
      </CenterModal>
    );
  }
}

ResellItemsModal.propTypes = {
  isInEditMode: PropTypes.bool,
  isMutating: PropTypes.bool,
  resellItemInfo: PropTypes.object,
  resellItemID: PropTypes.string,
  onCloseModal: PropTypes.func.isRequired,
  onUpdateAfterResellItemArchived: PropTypes.func,
  onUpdateAfterResellItemCreated: PropTypes.func,
  onUpdateAfterResellItemSaved: PropTypes.func,
};

ResellItemsModal.defaultProps = {
  resellItemInfo: {
    product: '',
    reseller: '',
    condition: 'new',
    askingPrice: '',
  },
  isInEditMode: false,
};

const mapStateToProps = state => {
  return {
    isMutating: state[TestObjectsDuck.duckName].resellItems.isMutating,
    resellers: state[TestObjectsDuck.duckName].resellers.data,
    sneakers: state[AdminDuck.duckName].sneakers.data,
    apparel: state[AdminDuck.duckName].apparel.data,
    sizing: state[AdminDuck.duckName].sizing.data,
  };
};

export default connect(mapStateToProps)(ResellItemsModal);
