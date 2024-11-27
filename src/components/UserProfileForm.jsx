import PropTypes from "prop-types";
import InputField from "../components/InputField";
import "../assets/css/UserProfileForm.style.css";
import React from "react";

const UserProfileFormComponent = ({
  userInfo,
  isEditable = false,
  handleInputChange = () => {},
}) => {
  return (
    <div className={`profile-info ${isEditable ? "editable" : "read-only"}`}>
      <div className="profile-info-section">
        <h2 className="profile-section-title">Thông tin cá nhân</h2>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>Họ tên</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.fullname || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("fullname", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>Ngày sinh</label>
            <InputField
              type="date"
              className="profile-input"
              value={userInfo.birthday || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("birthday", e.target.value)}
            />
          </div>
        </div>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>Số CCCD</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.identifyCardNumber || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("identifyCardNumber", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>Ngày cấp</label>
            <InputField
              type="date"
              className="profile-input"
              value={userInfo.identifyCardIssuedDate || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("identifyCardIssuedDate", e.target.value)}
            />
          </div>
        </div>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>Nơi cấp</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.identifyCardIssuedPlace || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("identifyCardIssuedPlace", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>Giới tính</label>
            {isEditable ? (
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    checked={userInfo.gender === "MALE"}
                    disabled={!isEditable}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  />
                  Nam
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    checked={userInfo.gender === "FEMALE"}
                    disabled={!isEditable}
                    onChange={(e) => handleInputChange("gender", e.target.value)}
                  />
                  Nữ
                </label>
              </div>
            ) : (
              <span className="gender-text profile-input">{userInfo.gender === "MALE" ? "Nam" : "Nữ"}</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-info-section">
        <h2 className="profile-section-title">Thông tin liên lạc</h2>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>Email riêng</label>
            <InputField
              type="email"
              className="profile-input"
              value={userInfo.personalEmail || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("personalEmail", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>Email làm việc</label>
            <InputField
              type="email"
              className="profile-input"
              value={userInfo.workEmail || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("workEmail", e.target.value)}
            />
          </div>
        </div>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>Số điện thoại</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.phoneNumbers ? userInfo.phoneNumbers.join(", ") : "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("phoneNumbers", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="profile-info-section">
        <h2 className="profile-section-title">Địa chỉ</h2>
        <div className="profile-info-row">
          <div className="profile-info-field profile-info-field-full">
            <label>Địa chỉ nhà</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.homeAddress || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("homeAddress", e.target.value)}
            />
          </div>
        </div>
        <div className="profile-info-row">
          <div className="profile-info-field profile-info-field-full">
            <label>Địa chỉ nơi làm việc</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.workAddress || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("workAddress", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

UserProfileFormComponent.propTypes = {
  userInfo: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  handleInputChange: PropTypes.func,
};
const UserProfileForm = React.memo(UserProfileFormComponent);
export default UserProfileForm;