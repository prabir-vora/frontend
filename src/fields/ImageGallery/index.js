import React, { Component } from 'react';
import Gallery from 'react-image-gallery';

import './index.css';

export default class ImageGallery extends Component {
  render() {
    return <Gallery {...this.props} />;
  }
}
