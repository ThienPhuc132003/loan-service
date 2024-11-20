import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/UpdateUserProfile.style.css";
import Button from "../components/Button";
import InputField from "../components/InputField";
import RadioGroup from "../components/Radio";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";

const UpdateUserProfilePage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [updatedData, setUpdatedData] = useState({});
  const navigate = useNavigate();

  const handleInputChange = useCallback((field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  const handleGenderChange = useCallback((selectedGender) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      gender: selectedGender === "Nam" ? "MALE" : "FEMALE",
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    const {
      fullname,
      avatar,
      personalEmail,
      phoneNumber,
      jobTitle,
      income,
      identifyCardNumber,
      identifyCardIssuedDate,
      identifyCardIssuedPlace,
      borrowerIncomeProofDocuments,
      homeAddress,
      workAddress,
      birthday,
      gender,
      socialLink,
      bankAccounts,
      signAttachments,
    } = updatedData;

    const dataToUpdate = {
      fullname: fullname ?? userInfo.fullname,
      avatar: avatar ?? userInfo.avatar,
      emails: [{ title: "Personal", content: personalEmail ?? userInfo.personalEmail }],
      phoneNumbers: [{ title: "Mobile", content: phoneNumber ?? userInfo.phoneNumber }],
      jobTitle: jobTitle ?? userInfo.jobTitle,
      income: income ?? userInfo.income,
      identifyCardNumber: identifyCardNumber ?? userInfo.identifyCardNumber,
      identifyCardIssuedDate: identifyCardIssuedDate ?? userInfo.identifyCardIssuedDate,
      identifyCardIssuedPlace: identifyCardIssuedPlace ?? userInfo.identifyCardIssuedPlace,
      borrowerIncomeProofDocuments: borrowerIncomeProofDocuments ?? userInfo.borrowerIncomeProofDocuments,
      homeAddress: homeAddress ?? userInfo.homeAddress,
      workAddress: workAddress ?? userInfo.workAddress,
      birthday: birthday ?? userInfo.birthday,
      gender: gender ?? userInfo.gender,
      socialLink: socialLink ?? userInfo.socialLink,
      bankAccounts: bankAccounts ?? userInfo.bankAccounts,
      signAttachments: signAttachments ?? userInfo.signAttachments,
    };

    try {
      const response = await Api({
        endpoint: "http://152.42.232.101:9005/api/v1/loan-service/borrower/update-profile",
        method: METHOD_TYPE.POST,
        data: dataToUpdate,
      });
      console.log("Update successful:", response);
      navigate("/user-profile");
    } catch (error) {
      console.error("Update failed:", error);
    }
  }, [updatedData, userInfo, navigate]);

  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const currentPath = "/user-profile";

  return (
    <MainLayout currentPath={currentPath} currentPage="Update Profile">
      <div className="update-profile-info">
        <div className="update-profile-avatar-container">
          <img
            src={userInfo.avatar || "default-avatar.png"}
            alt="User Avatar"
            className="update-profile-avatar"
          />
          <Button className="update-avatar-button update-change-avatar-button">
            Đổi ảnh đại diện
          </Button>
        </div>

        <div className="update-profile-info-section">
          <h2 className="update-profile-section-title">Thông tin cá nhân</h2>
          <div className="update-profile-info-row">
            <div className="update-profile-info-field">
              <label>Họ tên</label>
              <InputField
                type="text"
                className="update-profile-input"
                value={updatedData.fullname ?? userInfo.fullname ?? ""}
                onChange={(e) => handleInputChange("fullname", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Ngày sinh</label>
              <InputField
                type="date"
                className="update-profile-input"
                value={updatedData.birthday ?? userInfo.birthday ?? ""}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
              />
            </div>
          </div>
          <div className="update-profile-info-row">
            <div className="update-profile-info-field">
              <label>Số CCCD</label>
              <InputField
                type="text"
                className="update-profile-input"
                value={updatedData.identifyCardNumber ?? userInfo.identifyCardNumber ?? ""}
                onChange={(e) => handleInputChange("identifyCardNumber", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Ngày cấp</label>
              <InputField
                type="date"
                className="update-profile-input"
                value={updatedData.identifyCardIssuedDate ?? userInfo.identifyCardIssuedDate ?? ""}
                onChange={(e) => handleInputChange("identifyCardIssuedDate", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Nơi cấp</label>
              <InputField
                type="text"
                className="update-profile-input"
                value={updatedData.identifyCardIssuedPlace ?? userInfo.identifyCardIssuedPlace ?? ""}
                onChange={(e) => handleInputChange("identifyCardIssuedPlace", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Giới tính</label>
              <RadioGroup
                options={["Nam", "Nữ"]}
                name="gender"
                onChange={handleGenderChange}
              />
            </div>
          </div>
        </div>

        <div className="update-profile-info-section">
          <div className="update-profile-section-title">Thông tin liên lạc</div>
          <div className="update-profile-info-row">
            <div className="update-profile-info-field">
              <label>Email cá nhân</label>
              <InputField
                type="email"
                className="update-profile-input"
                value={updatedData.personalEmail ?? userInfo.personalEmail ?? ""}
                onChange={(e) => handleInputChange("personalEmail", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Email công việc</label>
              <InputField
                type="email"
                className="update-profile-input"
                value={updatedData.workEmail ?? userInfo.workEmail ?? ""}
                onChange={(e) => handleInputChange("workEmail", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Số điện thoại</label>
              <InputField
                type="text"
                className="update-profile-input"
                value={updatedData.phoneNumber ?? userInfo.phoneNumber ?? ""}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="update-profile-info-section">
          <div className="update-profile-section-title">Địa chỉ</div>
          <div className="update-profile-info-row">
            <div className="update-profile-info-field">
              <label>Địa chỉ nhà</label>
              <InputField
                type="text"
                className="update-profile-input"
                value={updatedData.homeAddress ?? userInfo.homeAddress ?? ""}
                onChange={(e) => handleInputChange("homeAddress", e.target.value)}
              />
            </div>
            <div className="update-profile-info-field">
              <label>Địa chỉ nơi làm việc</label>
              <InputField
                type="text"
                className="update-profile-input"
                value={updatedData.workAddress ?? userInfo.workAddress ?? ""}
                onChange={(e) => handleInputChange("workAddress", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button className="update-profile-button" onClick={handleSubmit}>
          Cập nhật thông tin
        </Button>
      </div>
    </MainLayout>
  );
};

const UpdateUserProfile = React.memo(UpdateUserProfilePage);
export default UpdateUserProfile;