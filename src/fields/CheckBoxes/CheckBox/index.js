import React, { Component } from "react";
import PropTypes from "prop-types";
import _pick from "lodash.pick";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Icons
import { CheckIcon } from "assets/Icons";

// Constants
const CHECKBOX_ATTRIBUTES = [
  "checked",
  "name",
  "readOnly",
  "required",
  "value"
];

class Checkbox extends Component {
  render() {
    const { checked, label, name, onChange, value } = this.props;
    return (
      <div className={Style.checkbox} onClick={() => onChange(value)}>
        <input
          {..._pick(this.props, CHECKBOX_ATTRIBUTES)}
          onChange={() => {}}
          type="checkbox"
        />
        {checked && <CheckIcon className={Style.checkIcon} />}
        <label
          className={cx(Style.label, checked && Style.checked)}
          htmlFor={name}
        >
          {label}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired
};

Checkbox.defaultProps = {
  checked: false,
  readOnly: false,
  required: false
};

export default Checkbox;
