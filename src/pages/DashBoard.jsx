import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatisticalChart from "../components/StatisticalChart";
import TotalLoan from "../components/TotalLoan";
import "../assets/css/DashBoard.style.css";
const DashBoardPage = () => {
  const currentPath = "/main-page";
  const data1 = [12, 19, 3, 5, 2, 3, 10, 15, 20, 25, 30, 35];
  const data2 = [8, 11, 5, 6, 7, 8, 12, 18, 22, 28, 33, 38];
  const labels = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <MainLayout
        currentPath={currentPath}
        currentPage={currentPath === "/main-page" ? "Dashboard" : "Page"}
      >
        <div className="loan-box">
          <TotalLoan title="Loan 1" amount="$1000" />
          <TotalLoan title="Loan 2" amount="$2000" />
          <TotalLoan title="Loan 3" amount="$3000" />
        </div>
        <StatisticalChart data1={data1} data2={data2} labels={labels} />
      </MainLayout>
    </>
  );
};

const DashBoard = React.memo(DashBoardPage);
export default DashBoard;
