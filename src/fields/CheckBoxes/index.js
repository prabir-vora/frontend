import React, { Component } from "react";
import PropTypes from "prop-types";

import Checkbox from "./CheckBox";

// Style
import TextInputStyle from "fields/Input/TextInput/style.module.scss";
import Style from "./style.module.scss";

class Checkboxes extends Component {
  onClickCheckbox = optionID => {
    if (!this.props.readOnly) {
      const { onChange } = this.props;
      onChange && onChange({ optionID });
    }
  };

  renderOptionsList = () =>
    Object.keys(this.props.options).map(optionID => {
      const option = this.props.options[optionID];
      const optionName = `${this.props.fieldID}.${optionID}`;
      return (
        <div className={Style.field} key={optionName}>
          <Checkbox
            {...option}
            label={this.props.renderOption(option)}
            name={optionName}
            onChange={this.onClickCheckbox}
            value={optionID}
          />
        </div>
      );
    });

  render() {
    return (
      <div>
        <div className={TextInputStyle.label}>{this.props.label}</div>
        <div className={Style.optionsContainer}>{this.renderOptionsList()}</div>
      </div>
    );
  }
}

Checkboxes.propTypes = {
  fieldID: PropTypes.string.isRequired,
  label: PropTypes.string,
  onChange: PropTypes.func,
  optionsAPI: PropTypes.string,
  options: PropTypes.object,
  readOnly: PropTypes.bool,
  renderOption: PropTypes.func.isRequired
};

Checkboxes.defaultProps = {
  label: "Checkboxes",
  optionsAPI: "",
  options: {},
  readOnly: false
};

export default Checkboxes;
