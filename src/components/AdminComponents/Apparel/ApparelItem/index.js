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

class ApparelItem extends Component {
  confirmNotif = null;

  state = {};

  onHideEditItemModal = () => this.setState({ showEditItemModal: false });

  onShowEditItemModal = () => this.setState({ showEditItemModal: true });

  onUpdateAfterApparelSaved = ({ updated, message }) => {
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

  onUpdateAfterApparelArchived = ({ deleted, message }) => {
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

  onSaveApparelImage = async imageURL => {
    const { actionCreators } = AdminDuck;
    const { updateApparelImage } = actionCreators;
    const { updated, message } = await this.props.dispatch(
      updateApparelImage(imageURL, this.props.apparelInfo),
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

  renderProductTemplateAvatar = () => {
    const imageURL = this.props.apparelInfo.original_image_url || '';
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
        type="apparel"
        name={this.props.apparelInfo.name}
        imageURL={this.props.apparelInfo.original_image_url}
        onCloseModal={this.onHideChangePhotoModal}
        onSaveImage={this.onSaveApparelImage}
      />
    );
  };

  renderProductTemplateLabel = () => {
    const { apparelInfo } = this.props;
    const { name } = apparelInfo;
    return (
      <React.Fragment>
        <div className={Style.productTemplateName}>{name}</div>
      </React.Fragment>
    );
  };

  renderEditModal = () => (
    <AdminModals.ApparelModal
      isInEditMode={true}
      apparelInfo={this.props.apparelInfo}
      onCloseModal={this.onHideEditItemModal}
      onUpdateAfterApparelArchived={this.onUpdateAfterApparelArchived}
      onUpdateAfterApparelSaved={this.onUpdateAfterApparelSaved}
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
        {this.props.apparelInfo && this.renderItem()}
      </React.Fragment>
    );
  }
}

ApparelItem.propTypes = {
  isInEditMode: PropTypes.bool,
  itemHelperButton: PropTypes.func,
  sneakerID: PropTypes.string,
  apparelInfo: PropTypes.shape({ name: PropTypes.string }).isRequired,
  onRefreshAfterChanges: PropTypes.func,
};

ApparelItem.defaultProps = {
  isInEditMode: true,
};

export default connect()(ApparelItem);
