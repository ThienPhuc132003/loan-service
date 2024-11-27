import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
// import "../assets/css/UserProfile.style.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";

import { setUserProfile } from "../redux/userSlice";
import UserProfileForm from "../components/UserProfileForm";
import BankAccountInfo from "../components/BankAccountInfo";
import UserOtherInfo from "../components/UserOtherInfo";
const UserProfilePage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [avatar, setAvatar] = useState(
    userInfo?.avatar || "default-avatar.png"
  );
  const dispatch = useDispatch();

  const [showCropper, setShowCropper] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const currentPath = "/user-profile";
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


  const handleUploadSuccess = useCallback(
    async (croppedFile) => {
      try {
        if (!(croppedFile instanceof Blob)) {
          throw new Error("Invalid file format. Must be an image file.");
        }

        const avatarResponse = await Api({
          endpoint:
            "media-service/media/media-url?mediaCategory=borrower_avatar",
          method: METHOD_TYPE.GET,
        });

        if (avatarResponse.code === 200) {
          const fileName = avatarResponse.data.fileName;
          const formData = new FormData();
          formData.append("file", croppedFile);

          const upLoadResponse = await Api({
            endpoint: `media-service/media/upload-media?mediaCategory=borrower_avatar&fileName=${fileName}`,
            method: METHOD_TYPE.POST,
            data: formData,
            isFormData: true,
          });

          if (upLoadResponse.success === true) {
            const pushAvatarToServer = await Api({
              endpoint: `loan-service/borrower/update-profile`,
              method: METHOD_TYPE.PUT,
              data: { avatar: upLoadResponse.data.mediaUrl },
            });
            dispatch(setUserProfile(pushAvatarToServer.data));
            setAvatar(pushAvatarToServer.data.avatar);
          } else {
            console.error("Upload thất bại:", upLoadResponse);
          }

        }
      } catch (error) {
        console.error("Lỗi upload ảnh:", error.message);
      } finally {
        setShowCropper(false);
      }

    },
    [dispatch]
  );


  // Hàm điều hướng tới trang cập nhật thông tin
  const handleUpdateProfile = useCallback(() => {
    navigate("/update-user-profile");
  }, [navigate]);

  // Xử lý trường hợp chưa tải được user info
  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const rightContent = (
    <div>
      <BankAccountInfo />
      <UserOtherInfo />
    </div>
  );
  return (
    <MainLayout
      currentPath={currentPath}
      currentPage="User Profile"
      rightChildren={rightContent}
    >
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

        {showCropper && (
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <button className="crop-image-upload-button" onClick={handleCrop}>
              Crop Image
            </button>
          </div>
        )}


        <UserProfileForm userInfo={userInfo} />

      </div>
    </MainLayout>
  );
};

export default React.memo(UserProfilePage);
