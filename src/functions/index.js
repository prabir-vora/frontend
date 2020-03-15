// Fields
import React from 'react';
import { Notification } from "fields";

const ShowConfirmNotif = ({ message, options, type }) => {
    const { CreateAlertNotification } = Notification;
    console.log("creating notification");
    return CreateAlertNotification({
      content: <div>{message || "Notification message"}</div>,
      options: options || { autoClose: 2000 },
      type: type || "default"
    });
  };


export {
    ShowConfirmNotif
}