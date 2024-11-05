import React from "react";
import MainLayout from "../components/layout/MainLayout";

function DashBoardPage() {
  const currentPath = "/main-page"; // Set the current path for the dashboard

  return (
    <MainLayout currentPath={currentPath}>
      <div>
        <h1>{currentPath === "/main-page" ? "Dashboard" : "Page"}</h1>
      </div>
    </MainLayout>
  );
}

const DashBoard = React.memo(DashBoardPage);
export default DashBoard;