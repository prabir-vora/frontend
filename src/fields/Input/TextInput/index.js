import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import _pick from "lodash.pick";

// Style
import Style from "./style.module.scss";

const INPUT_ATTRIBUTES = [
  "autoFocus",
  "errortext",
  "label",
  "max",
  "min",
  "name",
  "placeholder",
  "readOnly",
  "required",
  "rows",
  "type",
  "value"
];

class TextInput extends Component {
  state = { focused: false };

  onValidateValue = value => {
    const { errortext, regEx } = this.props;
    if (this.props.required && !value) return false;
    if (regEx) return value ? regEx.test(value) : true;
    if (this.props.showError && errortext) return false;
    return true;
  };

  onChangeValue = e => {
    const { onChange } = this.props;
    onChange && onChange(e.target.value);
  };

  onFormFocus = () => {
    const { onFocus } = this.props;
    this.setState({ focused: true }, () => onFocus && onFocus());
  };

  onFormBlur = () => {
    const { onBlur } = this.props;
    this.setState({ focused: false }, () => onBlur && onBlur());
  };

  onGetFieldClassname = isValueValid => {
    const { hasMultipleLines, readOnly } = this.props;
    const { focused } = this.state;
    return cx(
      Style.field,
      hasMultipleLines && Style.multilineField,
      !isValueValid && Style.invalid,
      focused && !readOnly && Style.focused,
      readOnly && Style.readOnly,
      this.props.fieldClassname
    );
  };

  renderFormFooter = isValueValid => {
    const { errortext, required } = this.props;
    return (
      <div className={Style.formFooter}>
        <div className={Style.dangerText}>{!isValueValid && errortext}</div>
        {required && <div className={Style.requiredText}>required</div>}
      </div>
    );
  };

  renderTextField = () => {
    const { hasMultipleLines } = this.props;
    const props = {
      ..._pick(this.props, INPUT_ATTRIBUTES),
      className: cx(Style.input, this.props.inputClassname),
      onBlur: this.onFormBlur,
      onChange: this.onChangeValue,
      onFocus: this.onFormFocus
    };
    return !hasMultipleLines ? (
      <input {...props} />
    ) : (
      <textarea {...props} style={{ border: "none" }} />
    );
  };

  render() {
    const { label, unit, value } = this.props;
    const isValueValid = this.onValidateValue(value);
    const labelForUnit = unit ? ` (${unit})` : "";
    return (
      <div
        className={this.props.className}
        onBlur={() => this.onValidateValue(value)}
      >
        <div className={this.onGetFieldClassname(isValueValid)}>
          {label && (
            <label
              className={cx(Style.label, this.props.labelClassname)}
            >{`${label}${labelForUnit}`}</label>
          )}
          {this.renderTextField()}
        </div>
        {this.renderFormFooter(isValueValid)}
      </div>
    );
  }
}

TextInput.propTypes = {
  errortext: PropTypes.string,
  hasMultipleLines: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  readOnly: PropTypes.bool,
  regEx: PropTypes.any,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any
};

TextInput.defaultProps = {
  hasMultipleLines: false,
  errortext: "",
  placeholder: "",
  readOnly: false,
  regEx: null,
  type: "text"
};

export default TextInput;
