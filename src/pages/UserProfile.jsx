import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/UserProfile.style.css";
import Button from "../components/Button";
import InputField from "../components/InputField";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";

const UserProfilePage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [avatar, setAvatar] = useState(
    userInfo?.avatar?.mediaUrl || "default-avatar.png"
  );
  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();
  console.log("userInfo", userInfo);
  // Hàm xử lý khi crop xong
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Hàm xử lý khi chọn file mới
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result); // Lưu base64 của ảnh
        setShowCropper(true); // Hiển thị Cropper
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm xử lý crop ảnh
  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      if (croppedImage) {
        await handleUploadSuccess(croppedImage);
      }
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  };

  // Hàm xử lý upload ảnh lên server
  const handleUploadSuccess = useCallback(async (croppedFile) => {
    try {
      // Lấy tên file từ server (nếu cần)
      const avatarResponse = await Api({
        endpoint:
          "http://152.42.232.101:9005/api/v1/media-service/media/media-url?mediaCategory=borrower_avatar",
        method: METHOD_TYPE.GET,
      });

      if (avatarResponse.code === 200) {
        const fileName = avatarResponse.data.fileName;

        // Tạo FormData và đính kèm file đã crop
        const formData = new FormData();
        formData.append("file", croppedFile);

        // Gửi request POST với FormData
        const response = await Api({
          endpoint: `http://152.42.232.101:9005/api/v1/media-service/media/upload-media?mediaCategory=borrower_avatar&fileName=${fileName}`,
          method: METHOD_TYPE.POST,
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Upload response:", response);

        if (response.success === true) {
          setAvatar(response.data.mediaUrl); // Cập nhật ảnh đại diện
          console.log("Upload success:", response.data.mediaUrl);
        } else {
          console.error("Upload failed:", response);
        }
      }
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setShowCropper(false); // Đóng cropper
    }
  }, []);

  // Hàm điều hướng tới trang cập nhật thông tin
  const handleUpdateProfile = useCallback(() => {
    navigate("/update-user-profile");
  }, [navigate]);

  // Xử lý trường hợp chưa tải được user info
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const currentPath = "/user-profile";

  return (
    <MainLayout currentPath={currentPath} currentPage="User Profile">
      <div className="profile-info">
        <div className="profile-avatar-container">
          <div className="profile-avatar-section">
            <img src={avatar} alt="User Avatar" className="profile-avatar" />
          </div>
          <div className="profile-avatar-buttons">
            <Button
              className="avatar-button change-avatar-button"
              onClick={() => document.getElementById("fileInput").click()}
            >
              Đổi ảnh đại diện
            </Button>
            <input
              type="file"
              accept="image/*"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <Button
            className="update-profile-button"
            onClick={handleUpdateProfile}
          >
            Cập nhật thông tin
          </Button>
        </div>

        {/* Hiển thị Cropper nếu cần */}
        {showCropper && (
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1} // Cắt ảnh theo tỷ lệ 1:1
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button className="crop-image-upload-button" onClick={handleCrop}>
              Crop Image
            </button>
          </div>
        )}

        {/* Thông tin cá nhân */}
        <div className="profile-info-section">
          <h2 className="profile-section-title">Thông tin cá nhân</h2>
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
          <h2 className="profile-section-title">Thông tin liên lạc</h2>
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
          <h2 className="profile-section-title">Địa chỉ</h2>
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

export default React.memo(UserProfilePage);
