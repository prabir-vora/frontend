import React, { Component } from 'react';
import PropTypes from "prop-types";

// Redux 
import { connect } from 'react-redux';

// Icons
import { AddPhotoIcon, PencilIcon } from "assets/Icons";

// Components
import AdminModals from "components/AdminModals";
import AdminDuck from "stores/ducks/Admin/Admin.duck";

// Fields
import { Chip, Img } from "fields";

// Additional Functions
import {
  ShowConfirmNotif
} from 'functions';

// Style
// import Style from "../style.module.scss";
import Style from "./style.module.scss";

class DesignerItem extends Component {

    confirmNotif = null;

    state = {}

    onHideEditItemModal = () => this.setState({ showEditItemModal: false });

    onShowEditItemModal = () => this.setState({ showEditItemModal: true });

    onUpdateAfterDesignerSaved = ({updated, message}) => {
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

    onUpdateAfterDesignerArchived = ({deleted, message}) => {
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

    onSaveDesignerImage = async (imageURL) => {
      const { actionCreators } = AdminDuck;
      const { updateDesignerImage } = actionCreators;

      const { updated, message } = await this.props.dispatch(updateDesignerImage(imageURL, this.props.designerInfo));

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
        const  imageURL  = this.props.designerInfo.imageURL || "";
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
          type="designers"
          name={this.props.designerInfo.name}
          imageURL={this.props.designerInfo.imageURL}
          onCloseModal={this.onHideChangePhotoModal}
          onSaveImage={this.onSaveDesignerImage}
        />
      );
    };


    renderChipLabel = () => {
        const { designerInfo } = this.props;
        const { name } = designerInfo;
        return (
          <React.Fragment>
            <div className={Style.chipName}>{name}</div>
          </React.Fragment>
        );
      };

    renderEditModal = () => (
        <AdminModals.DesignersModal
          isInEditMode={true}
          designerInfo={this.props.designerInfo}
          onCloseModal={this.onHideEditItemModal}
          onUpdateAfterDesignerArchived={this.onUpdateAfterDesignerArchived}
          onUpdateAfterDesignerSaved={this.onUpdateAfterDesignerSaved}
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
            {this.props.designerInfo && this.renderItem()}
        </React.Fragment>
        );
    }
}


DesignerItem.propTypes = {
    isInEditMode: PropTypes.bool,
    itemHelperButton: PropTypes.func,
    designerID: PropTypes.string,
    designerInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
    onRefreshAfterChanges: PropTypes.func
  };
  
  DesignerItem.defaultProps = {
    isInEditMode: true,
    designerInfo: {
        name: "Nike"
    }
  };

export default connect()(DesignerItem);