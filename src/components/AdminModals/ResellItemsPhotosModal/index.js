import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// Style
import Style from '../style.module.scss';

// Fields
import {
  Button,
  CenterModal,
  ModalBackButton,
  MultipleImagesUploader,
} from 'fields';

class ChangePhotoModal extends Component {
  confirmNotif = null;

  state = { images: [] };

  componentDidMount = () =>
    this.setState({
      images: this.props.images || [],
    });

  onChangeImages = images => {
    console.log(images);
    this.setState({ images });
  };

  onSaveResellItemImages = () => {
    const { onSaveImages } = this.props;
    onSaveImages(this.state.images);
  };

  renderMultipleImagesUploader = () => {
    return (
      <MultipleImagesUploader
        imageURLs={this.state.images}
        typeOfUpload={this.props.type}
        onUploadImages={this.onChangeImages}
      />
    );
  };

  render() {
    console.log(this.props);
    const { name } = this.props;
    return (
      <CenterModal
        closeModalButtonLabel={<ModalBackButton />}
        contentLabel="Change item image modal"
        modalBoxClassname={cx(
          Style.largeCenterModalBox,
          Style.modalBoxClassname,
        )}
        contentContainerClassname={Style.largeCenterModalContainer}
        onCloseModal={this.props.onCloseModal}
        shouldCloseOnOverlayClick={true}
      >
        <h2>{name}</h2>
        {this.renderMultipleImagesUploader()}
        <Button
          className={Style.saveButton}
          name="save new item image url"
          onClick={this.onSaveResellItemImages}
          status={this.state.imageURL !== '' ? 'active' : 'inactive'}
        >
          Save
        </Button>
      </CenterModal>
    );
  }
}

export default ChangePhotoModal;

ChangePhotoModal.propTypes = {
  name: PropTypes.string.isRequired,
  onCloseModal: PropTypes.func.isRequired,
  onSaveImages: PropTypes.func,
};
