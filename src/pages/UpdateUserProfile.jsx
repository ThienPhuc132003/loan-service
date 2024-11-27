import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
// import "../assets/css/UpdateUserProfile.style.css";
import Button from "../components/Button";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";

import { setUserProfile } from "../redux/userSlice";
import UserProfileForm from "../components/UserProfileForm";
import BankAccountInfo from "../components/BankAccountInfo";
import UserOtherInfo from "../components/UserOtherInfo";


const UpdateUserProfilePage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [updatedData, setUpdatedData] = useState({});
  const [avatar, setAvatar] = useState(
    userInfo?.avatar || "default-avatar.png"
  );
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const navigate = useNavigate();

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

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
      const dataToUpdate = {
        fullname: updatedData.fullname || userInfo.fullname,
        avatar: avatar,
        emails: updatedData.emails || userInfo.emails,
        phoneNumbers: updatedData.phoneNumbers || userInfo.phoneNumbers,
        jobTitle: updatedData.jobTitle || userInfo.jobTitle,
        income: updatedData.income || userInfo.income,
        identifyCardNumber:
          updatedData.identifyCardNumber || userInfo.identifyCardNumber,
        identifyCardIssuedDate:
          updatedData.identifyCardIssuedDate || userInfo.identifyCardIssuedDate,
        identifyCardIssuedPlace:
          updatedData.identifyCardIssuedPlace ||
          userInfo.identifyCardIssuedPlace,
        borrowerIncomeProofDocuments:
          updatedData.borrowerIncomeProofDocuments ||
          userInfo.borrowerIncomeProofDocuments,
        homeAddress: updatedData.homeAddress || userInfo.homeAddress,
        workAddress: updatedData.workAddress || userInfo.workAddress,
        birthday: updatedData.birthday || userInfo.birthday,
        gender: updatedData.gender || userInfo.gender,
        socialLink: updatedData.socialLink || userInfo.socialLink,
        bankAccounts: updatedData.bankAccounts || userInfo.bankAccounts,
        signAttachments:
          updatedData.signAttachments || userInfo.signAttachments,
      };

      const response = await Api({

        endpoint: "loan-service/borrower/update-profile",
        method: METHOD_TYPE.PUT,
        data: dataToUpdate,
      });
      console.log("Update successful:", response);
      dispatch(setUserProfile(response.data)); // Dispatch thông tin cập nhật

      navigate("/user-profile");
    } catch (error) {
      console.error("Update failed:", error);
    }

  }, [updatedData, avatar, userInfo, navigate, dispatch]);


  if (!userInfo) {
    return <div>Loading...</div>;
  }

  const currentPath = "/update-user-profile";
  const rightContent = (
    <div>
      <BankAccountInfo />
      <UserOtherInfo />
    </div>
  );
  return (
    <MainLayout
      currentPath={currentPath}
      currentPage="Update Profile"
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

      <UserProfileForm
        userInfo={{ ...userInfo, ...updatedData }}
        isEditable={true}
        handleInputChange={handleInputChange}
      />
      <Button className="update-profile-button" onClick={handleSubmit}>
        Cập nhật thông tin
      </Button>
    </MainLayout>
  );
};

export default React.memo(UpdateUserProfilePage);
