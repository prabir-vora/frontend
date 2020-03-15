import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import DesignerFormFields from "./designerFormFields";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class DesignersModal extends Component {

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
        return <h1>{this.props.isInEditMode ? "Edit" : "Create"} Designer</h1>;
      };

    onSubmitDesignerInfo = async (designerInfo) => {
      if (this.props.isInEditMode) {
        const { actionCreators } = AdminDuck;
        const { updateExistingDesigner } = actionCreators;
        const res = await this.props.dispatch(updateExistingDesigner(designerInfo));  
        this.props.onUpdateAfterDesignerSaved(res);
      } else { 
        const { actionCreators } = AdminDuck;
        const { createNewDesigner } = actionCreators;
        const res = await this.props.dispatch(createNewDesigner(designerInfo));
        this.props.onUpdateAfterDesignerCreated(res);
      }
    }

    onArchiveDesigner = async () => {
      const { actionCreators } = AdminDuck;
      const { removeExistingDesigner } = actionCreators;
      const res = await this.props.dispatch(removeExistingDesigner(this.props.designerInfo));
      this.props.onUpdateAfterDesignerArchived(res);

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
        const { isInEditMode, designerInfo } = this.props;
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
                name={designerInfo.name}
                onArchive={() =>
                  this.onArchiveDesigner()
                }
                onCloseModal={this.onHideConfirmArchiveModal}
              />
            )}
            {this.state.showLoadingModal && (
              <div>Loading...</div>
            )}
            {this.renderModalTitle()}
            <DesignerFormFields
              isInEditMode={isInEditMode}  
              designerInfo={designerInfo}
              onSubmit={this.onSubmitDesignerInfo}
            />
            {isInEditMode && this.renderArchiveItemButton()}
          </CenterModal>
        );
      }
}

DesignersModal.propTypes = {
    isInEditMode: PropTypes.bool,
    isMutating: PropTypes.bool,
    designerInfo: PropTypes.object,
    designerID: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    onUpdateAfterDesignerArchived: PropTypes.func,
    onUpdateAfterDesignerCreated: PropTypes.func,
    onUpdateAfterDesignerSaved: PropTypes.func
  };

DesignersModal.defaultProps = {
    designerInfo: {
        name: "",
    },
    isInEditMode: false
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isMutating: state[duckName].designers.isMutating
  };
};

export default connect(mapStateToProps)(DesignersModal);

