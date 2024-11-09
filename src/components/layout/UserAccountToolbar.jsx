import React from "react";
import PropTypes from "prop-types";
import User from "../User";

const UserAccountToolbarComponent = ({ onEditProfile, onLogout }) => {
  return (
    <div className="user-account-toolbar">
      <User onEditProfile={onEditProfile} onLogout={onLogout} />
    </div>
  );
};

// UserAccountToolbarComponent.propTypes = {
//   onEditProfile: PropTypes.func.isRequired,
//   onLogout: PropTypes.func.isRequired,
// };
UserAccountToolbarComponent.propTypes = {
  onEditProfile: PropTypes.func,
  onLogout: PropTypes.func,
};

const UserAccountToolbar = React.memo(UserAccountToolbarComponent);
export default UserAccountToolbar;