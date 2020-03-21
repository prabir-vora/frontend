import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

// Icons
import { AddPhotoIcon, PencilIcon } from 'assets/Icons';

// Components
import AdminModals from 'components/AdminModals';

// Fields
import { ProductTemplate, Img } from 'fields';

// Additional Functions
import { ShowConfirmNotif } from 'functions';

// Style
// import Style from "../style.module.scss";
import Style from './style.module.scss';

class SneakerItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterSneakerSaved = ({ updated, message }) => {
    if (updated) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });
      this.setState({ showEditItemModal: false }, () =>
        this.props.onRefreshAfterChanges(),
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
      this.setState({ showEditItemModal: false });
    }
  };

  onUpdateAfterSneakerArchived = ({ deleted, message }) => {
    if (deleted) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });
      this.setState({ showEditItemModal: false }, () =>
        this.props.onRefreshAfterChanges(),
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
      this.setState({ showEditItemModal: false });
    }
  };

  onShowChangePhotoModal = () => this.setState({ showChangePhotoModal: true });

  onHideChangePhotoModal = () => this.setState({ showChangePhotoModal: false });

  onSaveSneakerImage = async imageURL => {
    const { actionCreators } = AdminDuck;
    const { updateSneakerImage } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateSneakerImage(imageURL, this.props.sneakerInfo),
    );

    if (updated) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });
      this.setState({ showChangePhotoModal: false }, () =>
        this.props.onRefreshAfterChanges(),
      );
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
      this.setState({ showChangePhotoModal: false });
    }
  };

  onSaveSneakerAdditionalImages = async imageURLs => {
    const { actionCreators } = AdminDuck;
    const { updateSneakerAdditionalImages } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateSneakerAdditionalImages(imageURLs, this.props.sneakerInfo),
    );

    if (updated) {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'success',
      });
    } else {
      this.confirmNotif = ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
  };

  renderProductTemplateAvatar = () => {
    const imageURL = this.props.sneakerInfo.original_image_url || '';
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
        type="sneakers"
        name={this.props.sneakerInfo.name}
        imageURL={this.props.sneakerInfo.original_image_url}
        onCloseModal={this.onHideChangePhotoModal}
        onSaveImage={this.onSaveSneakerImage}
        hasAdditionalImages={true}
        additional_pictures={this.props.sneakerInfo.additional_pictures}
        onSaveAdditionalImages={this.onSaveSneakerAdditionalImages}
      />
    );
  };

  renderProductTemplateLabel = () => {
    const { sneakerInfo } = this.props;
    const { name } = sneakerInfo;
    return (
      <React.Fragment>
        <div className={Style.productTemplateName}>{name}</div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.SneakersModal
      isInEditMode={true}
      sneakerInfo={this.props.sneakerInfo}
      onCloseModal={this.onHideEditItemModal}
      onUpdateAfterSneakerArchived={this.onUpdateAfterSneakerArchived}
      onUpdateAfterSneakerSaved={this.onUpdateAfterSneakerSaved}
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
    <div className={Style.productTemplateContainer}>
      <ProductTemplate
        avatar={this.renderProductTemplateAvatar()}
        label={this.renderProductTemplateLabel()}
        helperButtonContent={this.renderHelperButton()}
      />
    </div>
  );

  render() {
    return (
      <React.Fragment>
        {this.state.showChangePhotoModal && this.renderChangePhotoModal()}
        {this.state.showEditItemModal && this.renderEditModal()}
        {this.props.sneakerInfo && this.renderItem()}
      </React.Fragment>
    );
  }
}

SneakerItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  sneakerID: PropTypes.string,
  sneakerInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
  onRefreshAfterChanges: PropTypes.func,
};

SneakerItem.defaultProps = {
  isInEditMode: true,
};

export default connect()(SneakerItem);
