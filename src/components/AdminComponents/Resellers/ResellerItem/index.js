import React, { Component } from 'react';
import PropTypes from "prop-types";

// Redux 
import { connect } from "react-redux";
import TestObjectsDuck from "stores/ducks/Admin/TestObjects.duck";

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

class ResellerItem extends Component {

    confirmNotif = null;

    state = {}

    onHideEditItemModal = () => this.setState({ showEditItemModal: false });

    onShowEditItemModal = () => this.setState({ showEditItemModal: true });

    onUpdateAfterResellerSaved = ({updated, message}) => {
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

    onUpdateAfterResellerArchived = ({deleted, message}) => {
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

    onSaveResellerImage = async (imageURL) => {
      const { actionCreators } = TestObjectsDuck;
      const { updateResellerImage } = actionCreators;
      const { updated, message } = await this.props.dispatch(updateResellerImage(imageURL, this.props.resellerInfo));

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

    renderChipAvatar = () => {
        const  imageURL  = this.props.resellerInfo.imageURL || "";
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
          type="resellers"
          name={this.props.resellerInfo.name}
          imageURL={this.props.resellerInfo.imageURL}
          onCloseModal={this.onHideChangePhotoModal}
          onSaveImage={this.onSaveResellerImage}
        />
      );
    };


    renderChipLabel = () => {
        const { resellerInfo } = this.props;
        const { name } = resellerInfo;
        return (
          <React.Fragment>
            <div className={Style.chipName}>{name}</div>
          </React.Fragment>
        );
      };

    renderEditModal = () => (
        <AdminModals.ResellersModal
          isInEditMode={true}
          resellerInfo={this.props.resellerInfo}
          onCloseModal={this.onHideEditItemModal}
          onUpdateAfterResellerArchived={this.onUpdateAfterResellerArchived}
          onUpdateAfterResellerSaved={this.onUpdateAfterResellerSaved}
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
            {this.props.resellerInfo && this.renderItem()}
        </React.Fragment>
        );
    }
}


ResellerItem.propTypes = {
    isInEditMode: PropTypes.bool,
    itemHelperButton: PropTypes.func,
    resellerID: PropTypes.string,
    resellerInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
    onRefreshAfterChanges: PropTypes.func
  };
  
  ResellerItem.defaultProps = {
    isInEditMode: true,
    resellerInfo: {
        name: ""
    }
  };

  export default connect()(ResellerItem);