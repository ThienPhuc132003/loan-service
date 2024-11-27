import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatisticalChart from "../components/StatisticalChart";
import TotalLoan from "../components/TotalLoan";
import "../assets/css/DashBoard.style.css";
import { useSelector } from "react-redux";
import News from "../components/News";
const DashBoardPage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
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
  const rightContent = (
    <div className="real-time-container">
      <News />
    </div>
  );
  return (
    <>
      <MainLayout
        currentPath={currentPath}
        currentPage={currentPath === "/main-page" ? "Dashboard" : "Page"}
        rightChildren={rightContent}
      >
        <h2>Chào mừng quay lại, {userInfo.fullname}</h2>
        <p>
          bạn có một khoản vay{" "}
          <span className="hight-light">10.000.000 đồng</span> cần thanh toán
          vào ngày <span className="hight-light">dd/mm/yy</span>
        </p>
        <div className="loan-box">
          <TotalLoan
            cardName="total-amount-borrowed1"
            title="Tổng số tiền đã vay"
            amount="156.000.000 đồng"
          />
          <TotalLoan
            cardName="total-amount-borrowed2"
            title="Tổng thanh toán theo tháng"
            amount="5.500.000 đồng"
          />
          <TotalLoan
            cardName="total-amount-borrowed2"
            title="Tổng khoản vay"
            amount="15 khoản vay"
          />
        </div>
        <div className="chart-info">
          <h2>Thống kê khoản vay</h2>
          <p>số tiền đã vay</p>
          <p>15.000.000 đồng</p>
          <p>Tổng số tiền đã vay trong tháng</p>
          <StatisticalChart data1={data1} data2={data2} labels={labels} />
        </div>
      </MainLayout>
    </>
  );
};

const DashBoard = React.memo(DashBoardPage);
export default DashBoard;
