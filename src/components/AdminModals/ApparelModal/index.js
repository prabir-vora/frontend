import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import ApparelFormFields from "./apparelFormFields";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class ApparelModal extends Component {
    state = {
        showLoadingModal: false
    }

    componentWillUnmount = () => this.setState({ showLoadingModal: false });

    // On Change Methods 

    onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false });

    onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true });

    renderModalTitle = () => {
        return <h1>{this.props.isInEditMode ? "Edit" : "Create"} Apparel</h1>;
      };

    onSubmitApparelInfo = async (apparelInfo) => {
        if (this.props.isInEditMode) {
            const { actionCreators } = AdminDuck;
            const { updateExistingApparel } = actionCreators;
            const res = await this.props.dispatch(updateExistingApparel(apparelInfo));
            console.log(res);  
            this.props.onUpdateAfterApparelSaved(res);
        } else { 
            const { actionCreators } = AdminDuck;
            const { createNewApparel } = actionCreators;
            const res = await this.props.dispatch(createNewApparel(apparelInfo));
            this.props.onUpdateAfterApparelCreated(res);
        }
    }

    onArchiveApparel = async () => {
        const { actionCreators } = AdminDuck;
        const { removeExistingApparel } = actionCreators;
        const res = await this.props.dispatch(removeExistingApparel(this.props.apparelInfo));
        this.props.onUpdateAfterApparelArchived(res);
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
        
        const { isInEditMode, apparelInfo } = this.props;
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
                name={apparelInfo.name}
                onArchive={() =>
                  this.onArchiveApparel()
                }
                onCloseModal={this.onHideConfirmArchiveModal}
              />
            )}
            {this.state.showLoadingModal && (
              <div>Loading...</div>
            )}
            {this.renderModalTitle()}
            <ApparelFormFields
              isInEditMode={isInEditMode}  
              onSubmit={this.onSubmitApparelInfo}
              brands={this.props.brands}
              designers={this.props.designers}
              apparelInfo={this.props.apparelInfo}
            />
            {isInEditMode && this.renderArchiveItemButton()}
          </CenterModal>
        );
      }
}

ApparelModal.propTypes = {
    isInEditMode: PropTypes.bool,
    isMutating: PropTypes.bool,
    apparelInfo: PropTypes.object,
    apparelID: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    onUpdateAfterApparelArchived: PropTypes.func,
    onUpdateAfterApparelCreated: PropTypes.func,
    onUpdateAfterApparelSaved: PropTypes.func
  };

ApparelModal.defaultProps = {
    isInEditMode: false
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isMutating: state[duckName].apparel.isMutating,
    brands: state[duckName].brands.data,
    designers: state[duckName].designers.data
  };
};

export default connect(mapStateToProps)(ApparelModal);
