import React from "react";

import MainLayout from "../components/layout/MainLayout";

const DashBoardPage = () => {

  const currentPath = "/main-page";




  return (
    <>
      <MainLayout
        currentPath={currentPath}
        currentPage={currentPath === "/main-page" ? "Dashboard" : "Page"}
      ></MainLayout>



    </>
  );
};

const DashBoard = React.memo(DashBoardPage);
export default DashBoard;
