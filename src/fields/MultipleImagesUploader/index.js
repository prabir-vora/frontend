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

class MultipleImagesUploader extends Component {
  state = {
    files: [],
    isUploading: false,
  };

  componentDidMount() {
    this.setState({ imageURLs: this.props.imageURLs || [] });
  }

  // Set the file to state
  onChange = e => {
    console.log(e.target.files);
    for (var i = 0; i < e.target.files.length; i++) {
      if (e.target.files[i].size > 5242880) {
        ShowConfirmNotif({
          message: 'Image size larger than 5 mb',
          type: 'error',
        });
        return;
      }
    }
    this.setState({
      files: e.target.files,
      isUploading: false,
    });
  };

  // Handle Changes with
  onSubmit = async e => {
    e.preventDefault();
    this.setState({ isUploading: true });
    const { files } = this.state;

    if (files.length === 0) {
      ShowConfirmNotif({
        message: 'Choose file first',
        type: 'error',
      });
      return;
    }

    const { typeOfUpload } = this.props;
    const listOfFiles = [];
    for (var i = 0; i < files.length; i++) {
      listOfFiles.push(files[i]);
    }
    console.log(listOfFiles);
    const { actionCreators } = AdminDuck;
    const { uploadImages } = actionCreators;

    const { success, imageURLs, message } = await this.props.dispatch(
      uploadImages(listOfFiles, typeOfUpload),
    );
    if (success) {
      ShowConfirmNotif({
        message,
        type: 'success',
      });
      console.log(imageURLs);
      this.props.onUploadImages(imageURLs);
    } else {
      ShowConfirmNotif({
        message,
        type: 'error',
      });
    }
    this.setState({ isUploading: false });
  };

  renderCurrentImages = () => {
    const { imageURLs } = this.state;
    console.log(this.state);
    if (imageURLs !== undefined && imageURLs.length !== 0) {
      return imageURLs.map(imageURL => {
        return (
          <div key={imageURL} className={Style.imageContainer}>
            <Img className={Style.image} src={imageURL} />
          </div>
        );
      });
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
        multiple
        onChange={this.onChange}
      />
      <br />
      <Button
        className={Style.uploadButton}
        name="Upload Images"
        type="submit"
        status={
          this.state.isUploading || this.state.files.length === 0
            ? 'inactive'
            : 'active'
        }
      >
        Upload Images
      </Button>
    </form>
  );

  render() {
    console.log(this.props);
    if (this.state.isFetching) {
      return (
        <div style={{ textAlign: 'center' }}>
          <ClipLoader color={'#000000'} loading={true} />
        </div>
      );
    }

    return (
      <div>
        <h2>Additional Images</h2>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {this.renderCurrentImages()}
        </div>
        {this.renderUploadForm()}
      </div>
    );
  }
}

export default connect()(MultipleImagesUploader);

MultipleImagesUploader.propTypes = {
  imageURLs: PropTypes.array,
  typeOfUpload: PropTypes.string,
  onUploadImages: PropTypes.func,
};
