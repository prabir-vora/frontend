import React, { Component } from "react";
import PropTypes from "prop-types";
import _pick from "lodash.pick";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

const RADIO_BUTTON_ATTRIBUTES = [
  "checked",
  "name",
  "readOnly",
  "required",
  "value"
];

class RadioButton extends Component {
  render() {
    const { checked, label, name, onChange, value } = this.props;
    return (
      <div className={Style.radioButton} onClick={() => onChange(value)}>
        <input
          {..._pick(this.props, RADIO_BUTTON_ATTRIBUTES)}
          onChange={() => {}}
          type="radio"
        />
        <div className={Style.circle} />
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

RadioButton.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.string.isRequired
};

RadioButton.defaultProps = {
  checked: false,
  readOnly: false,
  required: false
};

export default RadioButton;
