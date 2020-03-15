import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

const RadioButton = props => (
  <button
    className={cx(Style.container, props.className)}
    onClick={() => props.onClick(props.id)}
  >
    <div
      className={cx(
        Style.radioButton,
        props.radioButtonClassName,
        props.checked && Style.checked
      )}
    >
      {props.checked && (
        <div className={cx(Style.circle, props.whiteCircleClassName)} />
      )}
    </div>
    <div
      className={cx(
        Style.label,
        props.labelClassName,
        props.checked && Style.highlighted
      )}
    >
      {props.label}
    </div>
  </button>
);

RadioButton.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onClick: PropTypes.func,
  radioButtonClassName: PropTypes.string,
  whiteCircleClassName: PropTypes.string
};

RadioButton.defaultProps = {
  className: "",
  checked: false,
  labelClassName: "",
  onClick: () => {},
  radioButtonClassName: "",
  whiteCircleClassName: ""
};

export default RadioButton;
