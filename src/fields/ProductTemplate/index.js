import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

class ProductTemplate extends React.Component {
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
      <div className={cx(Style.productTemplate, this.props.productTemplateClassname)}>
        {this.renderAvatar()}
        <div className={Style.infoContainer}>
            {this.renderLabel()}
            {this.renderHelperButton()}
        </div>
      </div>
    );
  }
}

ProductTemplate.propTypes = {
  avatar: PropTypes.any,
  productTemplateClassname: PropTypes.string,
  helperButtonClassname: PropTypes.string,
  helperButtonContent: PropTypes.any,
  label: PropTypes.any,
  labelClassname: PropTypes.string,
  onClickLabel: PropTypes.func
};

ProductTemplate.defaultProps = {
  onClickLabel: () => {}
};

export default ProductTemplate;
