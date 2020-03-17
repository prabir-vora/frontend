import React from "react";
import PropTypes from "prop-types";
import LazyLoad from "react-lazy-load";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

const placeholderImg = require("assets/Images/image-placeholder.png");

const DEFAULT_LAZYLOAD_OPTIONS = {
  debounce: false,
  offsetVertical: 100
};

const Img = props => {
  const lazyLoadProps = {
    ...DEFAULT_LAZYLOAD_OPTIONS,
    ...props.lazyLoadOptions
  };
  return (
    <LazyLoad
      className={props.lazyLoadClassname}
      {...lazyLoadProps}
      onContentVisible={props.onContentVisible}
    >
      <img
        alt="Not Found"
        onClick={props.onClick}
        onLoad={props.onLoad}
        className={cx(props.className, Style.image)}
        src={props.src || placeholderImg}
        style={props.style}
        onError={e => {
          e.target.src = placeholderImg;
          props.onError();
        }}
      />
    </LazyLoad>
  );
};

Img.propTypes = {
  className: PropTypes.any,
  lazyLoadOptions: PropTypes.object,
  lazyLoadClassname: PropTypes.any,
  onError: PropTypes.func,
  onLoad: PropTypes.func,
  src: PropTypes.string
};

Img.defaultProps = {
  lazyLoadOptions: {},
  lazyLoadClassname: "",
  onError: () => {},
  onLoad: () => {},
  src: ""
};

export default Img;
