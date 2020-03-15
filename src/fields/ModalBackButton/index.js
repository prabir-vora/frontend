import React from "react";
import PropTypes from "prop-types";

// Style
import Style from "./style.module.scss";

// Icons
import { ArrowIcon } from "assets/Icons";

const ModalBackButton = props => (
  <div className={Style.backButton} onClick={props.onClick}>
    <ArrowIcon />
    {props.label}
  </div>
);

ModalBackButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func
};

ModalBackButton.defaultProps = {
  label: "Back",
  onClick: () => {}
};

export default ModalBackButton;
