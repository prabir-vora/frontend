import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

const Button = ({
  children,
  className,
  disabled,
  formAction,
  loadingText,
  name,
  onBlur,
  onClick,
  status,
  type,
  value
}) => {
  const ButtonText = () =>
    status === "loading" ? `${loadingText} ...` : children;

  return (
    <button
      className={cx(
        className,
        Style.btn,
        (status === "inactive" || status === "loading") && Style.inactive
      )}
      disabled={disabled}
      formAction={formAction}
      name={name}
      onBlur={onBlur}
      onClick={onClick}
      type={type}
      value={value}
    >
      {ButtonText()}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
  disabled: PropTypes.bool,
  loadingText: PropTypes.string,
  name: PropTypes.string.isRequired,
  status: PropTypes.oneOf(["active", "inactive", "loading"]),
  type: PropTypes.oneOf(["button", "reset", "submit"])
};

Button.defaultProps = {
  disabled: false,
  loadingText: "Loading",
  status: "active",
  type: "submit"
};

export default Button;
