import React, { Component } from 'react';
import PropTypes from "prop-types";

// Redux 
import { connect } from "react-redux";
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Icons
import { AddPhotoIcon, PencilIcon } from "assets/Icons";

// Components
import AdminModals from "components/AdminModals";

// Fields
import { Chip, Img } from "fields";

// Additional Functions
import {
  ShowConfirmNotif
} from 'functions';

// Style
// import Style from "../style.module.scss";
import Style from "./style.module.scss";

class BrandItem extends Component {

    confirmNotif = null;

    state = {}

    onHideEditItemModal = () => this.setState({ showEditItemModal: false });

    onShowEditItemModal = () => this.setState({ showEditItemModal: true });

    onUpdateAfterBrandSaved = ({updated, message}) => {
      if (updated) {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "success"
        });
        this.setState({ showEditItemModal: false }, () => this.props.onRefreshAfterChanges());
      } else {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "error"
        });
        this.setState({ showEditItemModal: false });
      }
    }

    onUpdateAfterBrandArchived = ({deleted, message}) => {
      if (deleted) {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "success"
        });
        this.setState({ showEditItemModal: false }, () => this.props.onRefreshAfterChanges());
      } else {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "error"
        });
        this.setState({ showEditItemModal: false });
      }
    }

    onShowChangePhotoModal = () => this.setState({ showChangePhotoModal: true });

    onHideChangePhotoModal = () => this.setState({ showChangePhotoModal: false });

    onSaveBrandImage = async (imageURL) => {
      const { actionCreators } = AdminDuck;
      const { updateBrandImage } = actionCreators;
      const { updated, message } = await this.props.dispatch(updateBrandImage(imageURL, this.props.brandInfo));

      if (updated) {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "success"
        });
        this.setState({ showChangePhotoModal: false }, () => this.props.onRefreshAfterChanges());
      } else {
        this.confirmNotif = ShowConfirmNotif({
          message,
          type: "error"
        });
        this.setState({ showChangePhotoModal: false });
      }
    }


    onGetBrandImage = () => {
      // Get the images from the props of brands
    }

    renderChipAvatar = () => {
        const  imageURL  = this.props.brandInfo.imageURL || "";
        return imageURL ? (
          <Img
            alt=""
            className={Style.itemImage}
            onClick={this.onShowChangePhotoModal}
            src={imageURL}
          />
        ) : (
          <div onClick={this.onShowChangePhotoModal}>
            <AddPhotoIcon className={Style.addPhotoIcon} />
          </div>
        );
      };

    renderChangePhotoModal = () => {
      return (
        <AdminModals.ChangePhotoModal
          name={this.props.brandInfo.name}
          imageURL={this.props.brandInfo.imageURL}
          onCloseModal={this.onHideChangePhotoModal}
          onSaveImage={this.onSaveBrandImage}
        />
      );
    };


    renderChipLabel = () => {
        const { brandInfo } = this.props;
        const { name } = brandInfo;
        return (
          <React.Fragment>
            <div className={Style.chipName}>{name}</div>
          </React.Fragment>
        );
      };

    renderEditModal = () => (
        <AdminModals.BrandsModal
          isInEditMode={true}
          brandInfo={this.props.brandInfo}
          onCloseModal={this.onHideEditItemModal}
          onUpdateAfterBrandArchived={this.onUpdateAfterBrandArchived}
          onUpdateAfterBrandSaved={this.onUpdateAfterBrandSaved}
        />
      );

    renderHelperButton = () => {
        return (
          <PencilIcon
            className={Style.pencilIcon}
            onClick={this.onShowEditItemModal}
          />
        );
      };

    renderItem = () => (
        <div className={Style.chipContainer}>
          <Chip
            avatar={this.renderChipAvatar()}
            label={this.renderChipLabel()}
            helperButtonContent={this.renderHelperButton()}
          />
          {/* {this.renderSigns()} */}
        </div>
      );
    

    render() {
        return (
        <React.Fragment>
            {this.state.showChangePhotoModal && this.renderChangePhotoModal()}
            {this.state.showEditItemModal && this.renderEditModal()}
            {this.props.brandInfo && this.renderItem()}
        </React.Fragment>
        );
    }
}


BrandItem.propTypes = {
    isInEditMode: PropTypes.bool,
    itemHelperButton: PropTypes.func,
    brandID: PropTypes.string,
    brandInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
    onRefreshAfterChanges: PropTypes.func
  };
  
  BrandItem.defaultProps = {
    isInEditMode: true,
    brandInfo: {
        name: "Nike"
    }
  };

  export default connect()(BrandItem);