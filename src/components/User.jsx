import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../assets/css/User.style.css";
import Cookies from "js-cookie";

const UserComponent = ({
  onEditProfile,
  userName,
  userRole,
  avatarUrl,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    if (option === "editProfile") {
      onEditProfile();
    } else if (option === "logout") {
      navigate("/login");
      Cookies.remove("user");
    }
    setIsDropdownOpen(false);
  };

  const handleDoubleClick = () => {
    navigate("/user-profile");
  };

  return (
    <div className="user-dropdown" onClick={toggleDropdown} onDoubleClick={handleDoubleClick}>
      <div className="user-info-dropdown">
        <img src={avatarUrl} alt="User Avatar" className="user-avatar-square" />
        <div className="user-details">
          <span className="user-name">{userName}Thien Phuc</span>
          <span className="user-role">{userRole}khach hang</span>
        </div>
      </div>
      <div className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`} />

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div
            className="dropdown-item"
            onClick={() => handleOptionClick("editProfile")}
          >
            Edit Profile
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleOptionClick("logout")}
          >
            Logout
          </div>
        </div>
      )}
    </div>
  );
};

UserComponent.propTypes = {
  onEditProfile: PropTypes.func,
  userName: PropTypes.string,
  userRole: PropTypes.string,
  avatarUrl: PropTypes.string,
};

const User = React.memo(UserComponent);
export default User;