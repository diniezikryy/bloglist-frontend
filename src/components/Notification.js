import React from "react";

const Notification = ({ errorMessage, successMessage }) => {
  if (successMessage === null && errorMessage === null) {
    return null;
  } else if (successMessage) {
    return <div className="success">{successMessage}</div>;
  } else {
    return <div className="error">{errorMessage}</div>;
  }
};
export default Notification;
