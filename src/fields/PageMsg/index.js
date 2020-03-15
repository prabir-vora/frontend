import React from "react";
import PropTypes from "prop-types";

// Style
import Style from "./style.module.scss";

const PageMsg = ({ children }) => {
  return <div className={Style.msgContainer}>{children}</div>;
};

PageMsg.propTypes = {
  children: PropTypes.any.isRequired
};

export default PageMsg;
