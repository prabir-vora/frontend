import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import BrandFormFields from "./brandFormFields";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class BrandsModal extends Component {

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
        return <h1>{this.props.isInEditMode ? "Edit" : "Create"} Brand</h1>;
      };

    onSubmitBrandInfo = async (brandInfo) => {
      if (this.props.isInEditMode) {
        const { actionCreators } = AdminDuck;
        const { updateExistingBrand } = actionCreators;
        const res = await this.props.dispatch(updateExistingBrand(brandInfo));  
        this.props.onUpdateAfterBrandSaved(res);
      } else { 
        const { actionCreators } = AdminDuck;
        const { createNewBrand } = actionCreators;
        const res = await this.props.dispatch(createNewBrand(brandInfo));
        this.props.onUpdateAfterBrandCreated(res);
      }
    }

    onArchiveBrand = async () => {
      const { actionCreators } = AdminDuck;
      const { removeExistingBrand } = actionCreators;
      const res = await this.props.dispatch(removeExistingBrand(this.props.brandInfo));
      this.props.onUpdateAfterBrandArchived(res);

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
        const { isInEditMode, brandInfo } = this.props;
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
                name={brandInfo.name}
                onArchive={() =>
                  this.onArchiveBrand()
                }
                onCloseModal={this.onHideConfirmArchiveModal}
              />
            )}
            {this.state.showLoadingModal && (
              <div>Loading...</div>
            )}
            {this.renderModalTitle()}
            <BrandFormFields
              isInEditMode={isInEditMode}  
              brandInfo={brandInfo}
              onSubmit={this.onSubmitBrandInfo}
            />
            {isInEditMode && this.renderArchiveItemButton()}
          </CenterModal>
        );
      }
}

BrandsModal.propTypes = {
    isInEditMode: PropTypes.bool,
    isMutating: PropTypes.bool,
    brandInfo: PropTypes.object,
    brandID: PropTypes.string,
    onCloseModal: PropTypes.func.isRequired,
    onUpdateAfterBrandArchived: PropTypes.func,
    onUpdateAfterBrandCreated: PropTypes.func,
    onUpdateAfterBrandSaved: PropTypes.func
  };

BrandsModal.defaultProps = {
    brandInfo: {
        name: "",
    },
    isInEditMode: false
}

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    isMutating: state[duckName].brands.isMutating
  };
};

export default connect(mapStateToProps)(BrandsModal);

