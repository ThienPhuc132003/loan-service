import React from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/UserProfile.style.css";
import Button from "../components/Button";
import InputField from "../components/InputField";

const UserProfilePage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const currentPath = "/user-profile";

  return (
    <MainLayout currentPath={currentPath} currentPage="User Profile">
      <div className="profile-info">
        {/* Avatar and Buttons */}
        <div className="profile-avatar-container">
          <div className="profile-avatar-section">
            <img
              src={userInfo.avatar || "default-avatar.png"}
              alt="User Avatar"
              className="profile-avatar"
            />
          </div>
          <div className="profile-avatar-buttons">
            <Button className="avatar-button change-avatar-button">
              Đổi ảnh đại diện
            </Button>
            <Button className="avatar-button delete-avatar-button">
              Xóa ảnh đại diện
            </Button>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="profile-info-section">
          <div className="profile-section-title">Thông tin cá nhân</div>
          <div className="profile-info-row">
            <div className="profile-info-field">
              <label>Họ tên</label>
              <InputField
                type="text"
                className="profile-input"
                value={userInfo.fullname || "N/A"}
                readOnly
              />
            </div>
            <div className="profile-info-field">
              <label>Ngày sinh</label>
              <InputField
                type="text"
                className="profile-input"
                value={userInfo.birthday || "N/A"}
                readOnly
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
                readOnly
              />
            </div>
            <div className="profile-info-field">
              <label>Giới tính</label>
              <InputField
                type="text"
                className="profile-input"
                value={userInfo.gender === "MALE" ? "Nam" : "Nữ"}
                readOnly
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
                readOnly
              />
            </div>
            <div className="profile-info-field">
              <label>Ngày cấp</label>
              <InputField
                type="text"
                className="profile-input"
                value={userInfo.identifyCardIssuedDate || "N/A"}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Thông tin liên lạc */}
        <div className="profile-info-section">
          <div className="profile-section-title">Thông tin liên lạc</div>
          <div className="profile-info-row">
            <div className="profile-info-field">
              <label>Email riêng</label>
              <InputField
                type="text"
                className="profile-input"
                value={userInfo.personalEmail || "N/A"}
                readOnly
              />
            </div>
            <div className="profile-info-field">
              <label>Email làm việc</label>
              <InputField
                type="text"
                className="profile-input"
                value={userInfo.workEmail || "N/A"}
                readOnly
              />
            </div>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-field">
              <label>Số điện thoại</label>
              <InputField
                type="text"
                className="profile-input"
                value={
                  userInfo.phoneNumbers
                    ? userInfo.phoneNumbers.join(", ")
                    : "N/A"
                }
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="profile-info-section">
          <div className="profile-section-title">Địa chỉ</div>

          {/* Địa chỉ nhà */}
          <div className="profile-info-row">
            <div className="profile-info-field profile-info-field-full">
              <label>Địa chỉ nhà</label>
              <InputField
                type="text"
                className="profile-input-address"
                value={userInfo.homeAddress || "N/A"}
                readOnly
              />
            </div>
          </div>

          {/* Địa chỉ nơi làm việc */}
          <div className="profile-info-row">
            <div className="profile-info-field profile-info-field-full">
              <label>Địa chỉ nơi làm việc</label>
              <InputField
                type="text"
                className="profile-input-address"
                value={userInfo.workAddress || "N/A"}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

const UserProfile = React.memo(UserProfilePage);
export default UserProfile;