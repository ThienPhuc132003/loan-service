import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import UserAccountToolbar from "../components/layout/UserAccountToolbar";

const DashBoardPage = () => {
  const navigate = useNavigate();
  const currentPath = "/main-page";

  const handleEditProfile = () => {
    console.log("Edit Profile clicked");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/login");
  };

  return (
    <>
      <MainLayout
        currentPath={currentPath}
        currentPage={currentPath === "/main-page" ? "Dashboard" : "Page"}
      ></MainLayout>
      <UserAccountToolbar
        onEditProfile={handleEditProfile}
        onLogout={handleLogout}
      />
    </>
  );
};

const DashBoard = React.memo(DashBoardPage);
export default DashBoard;
