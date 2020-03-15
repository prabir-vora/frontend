import React from "react";
import { toast } from "react-toastify";
import cx from "classnames";

// Style
import Style from "./style.module.scss";

// Constants
const ALERT_TYPES = ["success", "error", "warning", "default"];

const DEFAULT_DIALOG_OPTIONS = (customOptions = {}) => {
  const { dialogContainerClass, dialogBodyClass } = customOptions;
  return {
    // autoClose: 1000,
    closeOnClick: false,
    closeButton: false,
    newestOnTop: true,
    hideProgressBar: true,
    className: cx(Style.notifDialogContainer, dialogContainerClass),
    bodyClassName: cx(Style.notifDialogBody, dialogBodyClass)
  };
};

const DEFAULT_ALERT_OPTIONS = (alertType, customOptions = {}) => {
  const { alertContainerClass, alertBodyClass } = customOptions;
  return {
    // autoClose: 1000,
    closeOnClick: true,
    closeButton: false,
    newestOnTop: true,
    hideProgressBar: true,
    className: cx(
      Style.notifAlertContainer,
      Style[alertType],
      alertContainerClass
    ),
    bodyClassName: cx(Style.notifAlertBody, alertBodyClass),
    position: "top-center"
  };
};

const CreateAlertNotification = ({ content, options, type }) => {
  const alertType = ALERT_TYPES.includes(type) ? type : "default";
  return toast(<div className={Style.notifContentContainer}>{content}</div>, {
    ...DEFAULT_ALERT_OPTIONS(alertType, options),
    ...options
  });
};

const CreateDialogNotification = ({ content, options }) => {
  return toast(<div className={Style.notifContentContainer}>{content}</div>, {
    ...DEFAULT_DIALOG_OPTIONS(options),
    ...options
  });
};

export default { CreateAlertNotification, CreateDialogNotification };
