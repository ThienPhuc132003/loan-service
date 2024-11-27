import React from "react";
import PropTypes from "prop-types";
import "../assets/css/UserOtherInfo.style.css";
import { useSelector } from "react-redux";
import InputField from "./InputField";
const UserOtherInfoComponent = ({ isEditable = false }) => {
  const userInfo = useSelector((state) => state.user.userProfile);
  return (
    <div className="user-other-info">
      <div className="user-other-info-header">
        <h2 className="user-other-info-title">Thông tin khác</h2>
        <button className="user-other-info-edit-button">Chỉnh sửa</button>
      </div>
      <div className="user-other-info-info-container">
        <div className="user-other-info-info-row">
          <div className="user-other-info-info-item">
            <label className="user-other-info-label">Nghề nghiệp</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.jobTitle  || "N/A"}
              readOnly={!isEditable}
            />
          </div>
          <div className="user-other-info-info-item">
            <label className="user-other-info-label">Thu nhập</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.income || "N/A"}
              readOnly={!isEditable}
            />
          </div>
        </div>
        <div className="user-other-info-social-links">
          <p className="user-other-info-label">Mạng xã hội</p>
          <div className="user-other-info-social-item">
          <i className="fa-brands fa-facebook fa-2xl"></i>
            <a
              href={userInfo.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="user-other-info-link"
            >
              {userInfo.socialLink}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

UserOtherInfoComponent.propTypes = {
  isEditable: PropTypes.bool,
  occupation: PropTypes.string.isRequired,
  income: PropTypes.string.isRequired,
  socialLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
      text: PropTypes.string,
      url: PropTypes.string,
    })
  ).isRequired,
};

const UserOtherInfo = React.memo(UserOtherInfoComponent);
export default UserOtherInfo;
