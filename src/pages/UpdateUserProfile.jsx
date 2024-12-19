import React, { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/Button";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { setUserProfile } from "../redux/userSlice";
import UserProfileForm from "../components/UserProfileForm";
import BankAccountInfo from "../components/BankAccountInfo";
import UserOtherInfo from "../components/UserOtherInfo";
import { useTranslation } from "react-i18next";
import "../assets/css/UpdateUserProfile.style.css";

const UpdateUserProfilePage = () => {
  const { t } = useTranslation();
  const [croppedFile, setCroppedFile] = useState(null);
  const userInfo = useSelector((state) => state.user.userProfile);
  const [updatedData, setUpdatedData] = useState({});
  const [avatar, setAvatar] = useState(userInfo?.avatar || "default-avatar.png");
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleInputChange = useCallback((field, value) => {
    setUpdatedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
      if (croppedImage) {
        setAvatar(URL.createObjectURL(croppedImage));
        setCroppedFile(croppedImage); 
        setShowCropper(false);
      }
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
  };

  const handleSubmit = useCallback(async () => {
    try {
      if (croppedFile) {
        const avatarResponse = await Api({
          endpoint: "media-service/media/media-url?mediaCategory=borrower_avatar",
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
            updatedData.avatar = upLoadResponse.data.mediaUrl;
          } else {
            console.error("Upload failed:", upLoadResponse);
          }
        }
      }
  
      const response = await Api({
        endpoint: "loan-service/borrower/update-profile",
        method: METHOD_TYPE.PUT,
        data: updatedData,
      });
  
      dispatch(setUserProfile(response.data));
      navigate("/user-profile");
    } catch (error) {
      console.error("Update failed:", error);
    }
  }, [updatedData, croppedFile, navigate, dispatch]);

  if (!userInfo) {
    return <div>{t("common.loading")}</div>;
  }

  const rightContent = (
    <div>
      <BankAccountInfo />
      <UserOtherInfo />
    </div>
  );

  return (
    <MainLayout
      currentPath="/update-user-profile"
      currentPage={t("userProfile.updateUserProfileTitle")}
      rightChildren={rightContent}
    >
      <div className="profile-avatar-container">
        <div className="profile-avatar-section">
          <img src={avatar} alt="User Avatar" className="profile-avatar" />
        </div>
        <div className="profile-avatar-buttons">
          <Button
            className="change-avatar-button"
            onClick={() => document.getElementById("fileInput").click()}
          >
            {t("userProfile.changeAvatar")}
          </Button>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
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
          <div className="cropper-buttons">
            <Button className="crop-image-upload-button" onClick={handleCrop}>
              {t("userProfile.cropImage")}
            </Button>
            <Button className="cancel-crop-button" onClick={handleCancelCrop}>
              {t("common.cancel")}
            </Button>
          </div>
        </div>
      )}

      <UserProfileForm
        userInfo={{ ...userInfo, ...updatedData }}
        isEditable={true}
        handleInputChange={handleInputChange}
      />
      <div className="update-user-profile-button-box">
        <Button className="update-profile-button" onClick={handleSubmit}>
          {t("common.submit")}
        </Button>
        <Button
          className="user-update-profile-cancel-button"
          onClick={() => navigate("/user-profile")}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </MainLayout>
  );
};

export default React.memo(UpdateUserProfilePage);