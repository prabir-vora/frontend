import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import TestObjectsDuck from 'stores/ducks/Admin/TestObjects.duck';

// Icons
import { AddPhotoIcon, PencilIcon } from 'assets/Icons';

// Components
import AdminModals from 'components/AdminModals';

// Fields
import { Chip, Img } from 'fields';

// Additional Functions
import { ShowConfirmNotif } from 'functions';

// Style
// import Style from "../style.module.scss";
import Style from './style.module.scss';

class ResellerItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterResellerSaved = ({ updated, message }) => {
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

  onUpdateAfterResellerArchived = ({ deleted, message }) => {
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

  onSaveResellerImage = async imageURL => {
    const { actionCreators } = TestObjectsDuck;
    const { updateResellerImage } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateResellerImage(imageURL, this.props.user),
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

  renderChipAvatar = () => {
    const imageURL = this.props.user.imageURL || '';
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
        name={this.props.user.name}
        imageURL={this.props.user.imageURL}
        onCloseModal={this.onHideChangePhotoModal}
        onSaveImage={this.onSaveResellerImage}
      />
    );
  };

  renderChipLabel = () => {
    const { user } = this.props;
    const { name, email } = user;
    return (
      <React.Fragment>
        <div className={Style.chipName}>{name}</div>
        <h3>{email}</h3>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.ResellersModal
      isInEditMode={true}
      user={this.props.user}
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
        {this.props.user && this.renderItem()}
      </React.Fragment>
    );
  }
}

ResellerItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  resellerID: PropTypes.string,
  user: PropTypes.shape({ name: PropTypes.string }).isRequired,
  onRefreshAfterChanges: PropTypes.func,
};

ResellerItem.defaultProps = {
  isInEditMode: true,
  user: {
    name: '',
  },
};

export default connect()(ResellerItem);
