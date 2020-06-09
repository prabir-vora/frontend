import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

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

  state = { images: [], showDetailedImages: false, imageIndex: 0 };

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

  renderDetailedImages = () => {
    const { imageIndex, images, showDetailedImages } = this.state;
    return (
      <React.Fragment>
        {showDetailedImages && images.length !== 0 && (
          <Lightbox
            mainSrc={images[imageIndex]}
            nextSrc={images[(imageIndex + 1) % images.length]}
            prevSrc={images[(imageIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ showDetailedImages: false })}
            onMovePrevRequest={() =>
              this.setState({
                imageIndex: (imageIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                imageIndex: (imageIndex + 1) % images.length,
              })
            }
            imageTitle={`Seller Image Uploads ${imageIndex + 1} / ${
              images.length
            }`}
          />
        )}
      </React.Fragment>
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
        <button
          style={{
            width: '150px',
            height: '40px',
            background: 'black',
            color: 'white',
            marginBottom: '20px',
          }}
          onClick={() =>
            this.setState({
              showDetailedImages: true,
            })
          }
        >
          View Images
        </button>
        {this.renderMultipleImagesUploader()}
        {this.renderDetailedImages()}
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
