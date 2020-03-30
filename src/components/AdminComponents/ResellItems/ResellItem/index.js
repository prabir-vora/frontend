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

class ResellItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterResellItemSaved = ({ updated, message }) => {
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

  onUpdateAfterResellItemArchived = ({ deleted, message }) => {
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

  onSaveResellItemImages = async images => {
    const { actionCreators } = TestObjectsDuck;
    const { updateResellItemImages } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateResellItemImages(images, this.props.resellItemInfo),
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
    const imageURL = this.props.resellItemInfo.imageURL || '';
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
      <AdminModals.ResellItemsPhotosModal
        type="resellItems"
        name={this.props.resellItemInfo.product.label}
        images={this.props.resellItemInfo.images}
        onCloseModal={this.onHideChangePhotoModal}
        onSaveImages={this.onSaveResellItemImages}
      />
    );
  };

  renderChipLabel = () => {
    const { resellItemInfo } = this.props;
    console.log(resellItemInfo);
    const { product, reseller, askingPrice, condition } = resellItemInfo;
    return (
      <React.Fragment>
        <h4 className={Style.chipName}>
          <span style={{ fontWeight: '800' }}>{product.label} by </span>
          <span style={{ color: '#1f2fd1' }}>{reseller.label}</span>
        </h4>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '0px',
            maxWidth: 'inherit',
          }}
        >
          <h4
            style={{
              margin: '5px',
              color: 'green',
              maxWidth: 'inherit',
              overflow: 'hidden',
            }}
          >
            ${askingPrice}{' '}
          </h4>
          <h4
            style={{
              margin: '5px',
              color: 'red',
              maxWidth: 'inherit',
              overflow: 'hidden',
            }}
          >
            Condition: {condition}{' '}
          </h4>
        </div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.ResellItemsModal
      isInEditMode={true}
      resellItemInfo={this.props.resellItemInfo}
      onCloseModal={this.onHideEditItemModal}
      onUpdateAfterResellItemArchived={this.onUpdateAfterResellItemArchived}
      onUpdateAfterResellItemSaved={this.onUpdateAfterResellItemSaved}
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
        {this.props.resellItemInfo && this.renderItem()}
      </React.Fragment>
    );
  }
}

ResellItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  resellerID: PropTypes.string,
  resellItemInfo: PropTypes.shape({
    product: PropTypes.object,
    reseller: PropTypes.object,
    askingPrice: PropTypes.string,
    condition: PropTypes.string,
  }).isRequired,
  onRefreshAfterChanges: PropTypes.func,
};

ResellItem.defaultProps = {
  isInEditMode: true,
  resellItemInfo: {
    name: '',
  },
};

export default connect()(ResellItem);
