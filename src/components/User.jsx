import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "../assets/css/User.style.css";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";

const UserComponent = ({  userRole }) => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  console.log(userInfo);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionClick = (option) => {
    if (option === "editProfile") {
      navigate("/update-user-profile");
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
    <div className="user-dropdown">
      <div className="user-info-dropdown">
        <img
          src={userInfo.avatar}
          alt="User Avatar"
          className="user-avatar-square"
          onDoubleClick={handleDoubleClick}
        />
        <div className="user-details" onClick={toggleDropdown}>
          <span className="user-name">{userInfo.fullname}</span>
          <span className="user-role">{userRole}khach hang</span>
        </div>
      </div>
      <div
        className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
        onClick={toggleDropdown}
      />

      {isDropdownOpen && (
        <div className="dropdown-menu">
          <div
            className="dropdown-item"
            onClick={() => handleOptionClick("editProfile")}
          >
            <i className="fa-regular fa-pen-to-square"></i>Edit Profile
          </div>
          <div
            className="dropdown-item"
            onClick={() => handleOptionClick("logout")}
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i>Logout
          </div>
        </div>
      )}
    </div>
  );
};

UserComponent.propTypes = {
  onEditProfile: PropTypes.func,
  userRole: PropTypes.string,
};

const User = React.memo(UserComponent);
export default User;
