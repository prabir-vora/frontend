import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Components
import { CenterModal, ModalBackButton } from "fields";
import SizingFormFields from "./sizingFormFields";
import ConfirmArchiveModal from "../ConfirmArchiveModal";

// Style
import ModalStyle from "../style.module.scss";

class BrandsModal extends Component {

    state = { 
        showLoadingModal: false,
    };

    componentWillUnmount = () => this.setState({ showLoadingModal: false });

    // On Change Methods 

    onHideConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: false });

    onShowConfirmArchiveModal = () =>
    this.setState({ showConfirmArchiveModal: true });

    renderModalTitle = () => {
        return (<div className={ModalStyle.modalTitleContainer}>
            <h1>{this.props.isInEditMode ? "Edit" : "Create"} Sizing</h1>
            <h4> Product Category: {this.props.productCategory}</h4>
            <h4> Gender: {this.props.gender.label}</h4>
        </div>);
      };

    onSubmitSizingInfo = async (brandChoice, selectedSizeRange) => {

      const { productCategory, gender } = this.props;
      if (this.props.isInEditMode) {
        // const { actionCreators } = AdminDuck;
        // const { updateExistingSizing } = actionCreators;
        // const res = await this.props.dispatch(updateExistingSizing());  
        // this.props.onUpdateAfterBrandSaved(res);
      } else { 
        const { actionCreators } = AdminDuck;
        const { createNewSizing } = actionCreators;
        const res = await this.props.dispatch(createNewSizing(productCategory, gender.id, brandChoice, selectedSizeRange));
        this.props.onUpdateAfterSizingCreated(res);
      }
    }

    onArchiveSizing = async () => {
    //   const { actionCreators } = AdminDuck;
    //   const { removeExistingBrand } = actionCreators;
    //   const res = await this.props.dispatch(removeExistingBrand(this.props.brandInfo));
    //   this.props.onUpdateAfterBrandArchived(res);

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
        const { isInEditMode, brands, size_range } = this.props;
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
                // name={brandInfo.name}
                onArchive={() =>
                  this.onArchiveSizing()
                }
                onCloseModal={this.onHideConfirmArchiveModal}
              />
            )}
            {this.state.showLoadingModal && (
              <div>Loading...</div>
            )}
            {this.renderModalTitle()}
            <SizingFormFields
              isInEditMode={isInEditMode}  
              brands={brands}
              size_range={size_range}
              onSubmit={this.onSubmitSizingInfo}
            />
            {isInEditMode && this.renderArchiveItemButton()}
          </CenterModal>
        );
      }
}

BrandsModal.propTypes = {
    isInEditMode: PropTypes.bool,
    // isMutating: PropTypes.bool,
    brands: PropTypes.array,
    productCategory: PropTypes.string,
    gender: PropTypes.string,
    size_range: PropTypes.object,
    onCloseModal: PropTypes.func.isRequired,
    onUpdateAfterSizingArchived: PropTypes.func,
    onUpdateAfterSizingCreated: PropTypes.func,
    onUpdateAfterSizingSaved: PropTypes.func
  };

// BrandsModal.defaultProps = {
//     brandInfo: {
//         name: "",
//     },
//     isInEditMode: false
// }

const mapStateToProps = state => {
  const { duckName } = AdminDuck;
  return {
    brands: state[duckName].brands.data
  };
};

export default connect(mapStateToProps)(BrandsModal);

