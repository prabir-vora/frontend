import React, { Component } from "react";
import PropTypes from "prop-types";

import RadioButton from "./RadioButton";

// Style
import TextInputStyle from "fields/Input/TextInput/style.module.scss";
import Style from "./style.module.scss";

class RadioButtons extends Component {
  onClickRadioButton = optionID => {
    const { onChange } = this.props;
    onChange && onChange({ optionID });
  };

  renderOptionsList = () =>
    Object.keys(this.props.options).map(optionID => {
      const option = this.props.options[optionID];
      const optionName = `${this.props.fieldID}.${optionID}`;
      return (
        <div className={Style.field} key={optionName}>
          <RadioButton
            {...option}
            label={this.props.renderOption(option)}
            name={optionName}
            onChange={this.onClickRadioButton}
            value={optionID}
          />
        </div>
      );
    });

  render() {
    const { label } = this.props;
    return (
      <div>
        <div className={TextInputStyle.label}>{label}</div>
        <div className={Style.optionsContainer}>{this.renderOptionsList()}</div>
      </div>
    );
  }
}

RadioButtons.propTypes = {
  fieldID: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  optionsAPI: PropTypes.string,
  options: PropTypes.object,
  renderOption: PropTypes.func.isRequired
};

RadioButtons.defaultProps = {
  label: "Radio Buttons",
  optionsAPI: "",
  options: {}
};

export default RadioButtons;
