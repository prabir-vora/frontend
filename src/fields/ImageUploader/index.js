import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';
import AdminDuck from 'stores/ducks/Admin/Admin.duck';

import { ClipLoader } from 'react-spinners';
import Img from '../Img';

import Style from './style.module.scss';
import Button from '../Button';
import { ShowConfirmNotif } from 'functions';

class ImageUploader extends Component {
  state = {
    file: null,
    isUploading: false,
    imageURL: '',
  };

  componentDidMount() {
    this.setState({ imageURL: this.props.imageURL });
  }

  // Set the file to state
  onChange = e => {
    console.log(e.target.files);
    if (e.target.files[0].size > 5242880) {
      ShowConfirmNotif({
        message: 'Image size larger than 5 mb',
        type: 'error',
      });
    }
    this.setState({
      file: e.target.files[0],
      isUploading: false,
    });
  };

  // Handle Changes with
  onSubmit = async e => {
    e.preventDefault();
    this.setState({ isUploading: true });
    const { file } = this.state;

    if (file === null || file === undefined) {
      ShowConfirmNotif({
        message: 'Choose file first',
        type: 'error',
      });
      return;
    }

    const { typeOfUpload } = this.props;

    const { actionCreators } = AdminDuck;
    const { uploadImage } = actionCreators;

    const { success, imageURL, message } = await this.props.dispatch(
      uploadImage(file, typeOfUpload),
    );
    if (success) {
      ShowConfirmNotif({
        message,
        type: 'success',
      });
      this.props.onUploadImage(imageURL);
      this.setState({ imageURL });
    } else {
      ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
    this.setState({ isUploading: false });
  };

  renderCurrentImage = () => {
    const { imageURL } = this.state;

    if (imageURL !== '') {
      return (
        <div className={Style.imageContainer}>
          <Img className={Style.image} src={imageURL} />
          <p style={{ fontSize: '1.1rem' }}>Current Image</p>
        </div>
      );
    }

    return null;
  };

  renderUploadForm = () => (
    <form
      style={{ width: '100%', paddingBottom: '10px', textAlign: 'center' }}
      onSubmit={this.onSubmit}
    >
      <input
        style={{ textAlign: 'center' }}
        type="file"
        accept="image/*"
        onChange={this.onChange}
      />
      <br />
      <Button
        className={Style.uploadButton}
        name="Upload Image"
        type="submit"
        status={
          this.state.isUploading || this.state.file === null
            ? 'inactive'
            : 'active'
        }
      >
        Upload
      </Button>
    </form>
  );

  render() {
    if (this.state.isFetching) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ClipLoader color={'#000000'} loading={true} />
        </div>
      );
    }

    return (
      <div>
        {this.renderCurrentImage()}
        {this.renderUploadForm()}
      </div>
    );
  }
}

ImageUploader.propTypes = {
  imageURL: PropTypes.string,
  typeOfUpload: PropTypes.string,
  onUploadImage: PropTypes.func,
};

export default connect()(ImageUploader);
