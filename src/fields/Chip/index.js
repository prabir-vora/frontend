import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

class Chip extends React.Component {
  renderAvatar = () =>
    this.props.avatar && (
      <button className={Style.avatar} onClick={e => e.preventDefault()}>
        {this.props.avatar}
      </button>
    );

  renderLabel = () => (
    <button
      className={cx(Style.label, this.props.labelClassname)}
      onClick={this.props.onClickLabel}
    >
      {this.props.label}
    </button>
  );

  renderHelperButton = () =>
    this.props.helperButtonContent && (
      <button
        className={cx(Style.helperButton, this.props.helperButtonClassname)}
        onClick={e => e.preventDefault()}
      >
        {this.props.helperButtonContent}
      </button>
    );

  render() {
    return (
      <div className={cx(Style.chip, this.props.chipClassname)}>
        {this.renderAvatar()}
        {this.renderLabel()}
        {this.renderHelperButton()}
      </div>
    );
  }
}

Chip.propTypes = {
  avatar: PropTypes.any,
  chipClassname: PropTypes.string,
  helperButtonClassname: PropTypes.string,
  helperButtonContent: PropTypes.any,
  label: PropTypes.any,
  labelClassname: PropTypes.string,
  onClickLabel: PropTypes.func
};

Chip.defaultProps = {
  onClickLabel: () => {}
};

export default Chip;
