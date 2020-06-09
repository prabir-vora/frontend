import React, { Component } from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { Img } from 'fields';

import { NavigateNextIcon, NavigatePreviousIcon } from 'assets/Icons';

import Style from './style.module.scss';
import cx from 'classnames';

export default class ProductImageGallery extends Component {
  state = {
    currentIndex: 0,
  };

  constructor(props) {
    super(props);
    this.nextSlide = this.nextSlide.bind(this);
    this.previousSlide = this.previousSlide.bind(this);
  }

  onChangeIndex = (oldIndex, index) => {
    this.setState(
      {
        currentIndex: index,
      },
      () => console.log(this.state),
    );
  };

  previousSlide = () => {
    this.slider.slickPrev();
  };

  nextSlide = () => {
    this.slider.slickNext();
  };

  render() {
    console.log(this.props);

    const activeImageScrollWidth = 100 / this.props.images.length;
    const activeImageScrollLeft =
      activeImageScrollWidth * this.state.currentIndex;
    const firstIndex = 0;
    const lastIndex = this.props.images.length - 1;

    return (
      <div className={Style.wrapper}>
        <Slider
          ref={c => (this.slider = c)}
          slidesToShow={1}
          slidesToScroll={1}
          dots={false}
          beforeChange={this.onChangeIndex}
          infinite={false}
          focusOnSelect={false}
          arrows={false}
        >
          {this.props.images.map(imageURL => {
            return (
              <div>
                <Img
                  onClick={() =>
                    this.props.onClickImage(this.state.currentIndex)
                  }
                  src={imageURL}
                  className={Style.galleryImage}
                />
              </div>
            );
          })}
        </Slider>
        <br />
        <br />
        <div className={Style.imageSlideNumber}>
          0{this.state.currentIndex + 1}/0{this.props.images.length}
        </div>
        <div className={Style.imageGallerySlider}>
          <span
            className={Style.imageGallerySliderActive}
            style={{
              width: `${activeImageScrollWidth}%`,
              left: `${activeImageScrollLeft}%`,
            }}
          ></span>
        </div>
        <div className={Style.imageGalleryButtons}>
          <div
            className={
              this.state.currentIndex === firstIndex
                ? cx(Style.imageGalleryButton, Style.disable)
                : Style.imageGalleryButton
            }
            onClick={this.previousSlide}
          >
            <NavigatePreviousIcon />
          </div>
          <div
            className={
              this.state.currentIndex === lastIndex
                ? cx(Style.imageGalleryButton, Style.disable)
                : Style.imageGalleryButton
            }
            onClick={this.nextSlide}
          >
            <NavigateNextIcon />
          </div>
        </div>
      </div>
    );
  }
}
