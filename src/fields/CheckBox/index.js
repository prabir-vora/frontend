import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Icons
import { CheckIcon } from "assets/Icons";

const Checkbox = props => (
  <button
    className={cx(Style.container, props.className)}
    onClick={() => props.onClick(props.id)}
  >
    <div
      className={cx(
        Style.checkbox,
        props.checkboxClassName,
        props.checked && Style.checked
      )}
    >
      {props.checked && (
        <CheckIcon className={cx(Style.checkIcon, props.checkIconClassName)} />
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

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelClassName: PropTypes.string,
  onClick: PropTypes.func,
  checkboxClassName: PropTypes.string,
  checkIconClassName: PropTypes.string
};

Checkbox.defaultProps = {
  className: "",
  checked: false,
  labelClassName: "",
  onClick: () => {},
  checkboxClassName: "",
  checkIconClassName: ""
};

export default Checkbox;
