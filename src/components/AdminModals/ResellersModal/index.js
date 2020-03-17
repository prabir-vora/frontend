import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from "stores/ducks/Admin/TestObjects.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import ResellerFormFields from "./resellerFormFields";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class ResellersModal extends Component {

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
        return <h1>{this.props.isInEditMode ? "Edit" : "Create"} Reseller</h1>;
      };

    onSubmitResellerInfo = async (resellerInfo) => {
      if (this.props.isInEditMode) {
        const { actionCreators } = TestObjectsDuck;
        const { updateExistingReseller } = actionCreators;
        const res = await this.props.dispatch(updateExistingReseller(resellerInfo));  
        this.props.onUpdateAfterResellerSaved(res);
      } else { 
        const { actionCreators } = TestObjectsDuck;
        const { createNewReseller } = actionCreators;
        const res = await this.props.dispatch(createNewReseller(resellerInfo));
        this.props.onUpdateAfterResellerCreated(res);
      }
    }

    onArchiveReseller = async () => {
      const { actionCreators } = TestObjectsDuck;
      const { removeExistingReseller } = actionCreators;
      const res = await this.props.dispatch(removeExistingReseller(this.props.resellerInfo));
      this.props.onUpdateAfterResellerArchived(res);
    }

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
            contentContainerClassname={
              ModalStyle.largeCenterModalContainer
            }
            onCloseModal={this.props.onCloseModal}
            shouldCloseOnOverlayClick={true}
          >
            {showConfirmArchiveModal && (
              <ConfirmArchiveModal
                name={resellerInfo.name}
                onArchive={() =>
                  this.onArchiveReseller()
                }
                onCloseModal={this.onHideConfirmArchiveModal}
              />
            )}
            {this.state.showLoadingModal && (
              <div>Loading...</div>
            )}
            {this.renderModalTitle()}
            <ResellerFormFields
              isInEditMode={isInEditMode}  
              resellerInfo={resellerInfo}
              onSubmit={this.onSubmitResellerInfo}
            />
            {isInEditMode && this.renderArchiveItemButton()}
          </CenterModal>
        );
      }
}

ResellersModal.propTypes = {
    isInEditMode: PropTypes.bool,
    isMutating: PropTypes.bool,
    resellerInfo: PropTypes.object,
    brandID: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    onUpdateAfterResellerArchived: PropTypes.func,
    onUpdateAfterResellerCreated: PropTypes.func,
    onUpdateAfterResellerSaved: PropTypes.func
  };

ResellersModal.defaultProps = {
    resellerInfo: {
        name: "",
    },
    isInEditMode: false
}

const mapStateToProps = state => {
  const { duckName } = TestObjectsDuck;
  return {
    isMutating: state[duckName].resellers.isMutating
  };
};

export default connect(mapStateToProps)(ResellersModal);

