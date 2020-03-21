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
  TextInput,
  Img,
  ImageUploader,
  MultipleImagesUploader,
} from 'fields';

class ChangePhotoModal extends Component {
  confirmNotif = null;

  state = { imageURL: '', additional_pictures: [] };

  componentDidMount = () =>
    this.setState({
      imageURL: this.props.imageURL || '',
      additional_pictures: this.props.additional_pictures || [],
    });

  onChangeImageURL = imageURL => this.setState({ imageURL });

  onChangeAdditionalImagesURLs = additional_pictures => {
    console.log(additional_pictures);
    this.setState({ additional_pictures });
  };

  onChangeItemImage = () => {
    const {
      onSaveImage,
      hasAdditionalImages,
      onSaveAdditionalImages,
    } = this.props;

    const { imageURL, additional_pictures } = this.state;
    onSaveImage(imageURL);
    hasAdditionalImages && onSaveAdditionalImages(additional_pictures);
  };

  renderImageUrlInput = () => (
    <TextInput
      hasMultipleLines={true}
      label="Image URL"
      name="URL Input"
      placeholder="Paste the URL here"
      onChange={this.onChangeImageURL}
      rows={3}
      value={this.state.imageURL}
    />
  );

  renderImage = () => {
    return (
      <div className={Style.imageContainer}>
        <Img className={Style.image} src={this.state.imageURL} />
        <p style={{ fontSize: '1.1rem' }}>Current Image</p>
      </div>
    );
  };

  renderImageUploader = () => {
    return (
      <ImageUploader
        imageURL={this.state.imageURL}
        typeOfUpload={this.props.type}
        onUploadImage={this.onChangeImageURL}
      />
    );
  };

  renderMultipleImagesUploader = () => {
    return (
      <MultipleImagesUploader
        imageURLs={this.state.additional_pictures}
        typeOfUpload={this.props.type}
        onUploadImages={this.onChangeAdditionalImagesURLs}
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
        {this.renderImageUrlInput()}
        {this.renderImageUploader()}
        {this.props.hasAdditionalImages && this.renderMultipleImagesUploader()}
        <Button
          className={Style.saveButton}
          name="save new item image url"
          onClick={this.onChangeItemImage}
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
  imageURL: PropTypes.string,
  onSaveImage: PropTypes.func.isRequired,
  hasAdditionalImages: PropTypes.bool,
  onSaveAdditionalImages: PropTypes.func,
};

ChangePhotoModal.defaultProps = {
  hasAdditionalImages: false,
};
