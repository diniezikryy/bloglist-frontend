import React from "react";
import PropTypes from "prop-types";

const Notification = ({ errorMessage, successMessage }) => {
  if (successMessage === null && errorMessage === null) {
    return null;
  } else if (successMessage) {
    return <div className="success">{successMessage}</div>;
  } else {
    return <div className="error">{errorMessage}</div>;
  }
};

Notification.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  successMessage: PropTypes.string.isRequired,
};

export default Notification;
