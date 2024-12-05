// File: src/components/UserProfileForm.jsx
import PropTypes from "prop-types";
import InputField from "../components/InputField";
import "../assets/css/UserProfileForm.style.css";
import React from "react";
import { useTranslation } from "react-i18next";

const UserProfileFormComponent = ({
  userInfo,
  isEditable = false,
  handleInputChange = () => {},
}) => {
  const { t } = useTranslation();

  return (
    <div className={`profile-info ${isEditable ? "editable" : "read-only"}`}>
      <div className="profile-info-section">
        <h2 className="profile-section-title">{t("userProfile.personalInfo")}</h2>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>{t("userProfile.fullName")}</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.fullname || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("fullname", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>{t("userProfile.birthday")}</label>
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
            <label>{t("userProfile.identifyCardNumber")}</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.identifyCardNumber || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("identifyCardNumber", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>{t("userProfile.identifyCardIssuedDate")}</label>
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
            <label>{t("userProfile.identifyCardIssuedPlace")}</label>
            <InputField
              type="text"
              className="profile-input"
              value={userInfo.identifyCardIssuedPlace || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("identifyCardIssuedPlace", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>{t("userProfile.gender")}</label>
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
                  {t("userProfile.male")}
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
                  {t("userProfile.female")}
                </label>
              </div>
            ) : (
              <span className="gender-text profile-input">{userInfo.gender === "MALE" ? t("userProfile.male") : t("userProfile.female")}</span>
            )}
          </div>
        </div>
      </div>

      <div className="profile-info-section">
        <h2 className="profile-section-title">{t("userProfile.contactInfo")}</h2>
        <div className="profile-info-row">
          <div className="profile-info-field">
            <label>{t("userProfile.personalEmail")}</label>
            <InputField
              type="email"
              className="profile-input"
              value={userInfo.personalEmail || "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("personalEmail", e.target.value)}
            />
          </div>
          <div className="profile-info-field">
            <label>{t("userProfile.workEmail")}</label>
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
            <label>{t("userProfile.phoneNumbers")}</label>
            <InputField
              type="text"
              className={`profile-input ${!isEditable ? "" : "non-editable"}`}
              value={Array.isArray(userInfo.phoneNumbers) ? userInfo.phoneNumbers.join(", ") : "N/A"}
              readOnly={!isEditable}
              onChange={(e) => handleInputChange("phoneNumbers", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="profile-info-section">
        <h2 className="profile-section-title">{t("userProfile.addressInfo")}</h2>
        <div className="profile-info-row">
          <div className="profile-info-field profile-info-field-full">
            <label>{t("userProfile.homeAddress")}</label>
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
            <label>{t("userProfile.workAddress")}</label>
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