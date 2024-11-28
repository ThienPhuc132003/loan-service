import React from "react";
import MainLayout from "../components/layout/MainLayout";
import StatisticalChart from "../components/StatisticalChart";
import TotalLoan from "../components/TotalLoan";
import "../assets/css/DashBoard.style.css";
import { useSelector } from "react-redux";
import News from "../components/News";
import { useTranslation } from "react-i18next"; // Import useTranslation

const DashBoardPage = () => {
  const { t } = useTranslation(); // Initialize useTranslation
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
        <h2>{t("common.welcomeBack", { name: userInfo.fullname })}</h2>
        <p>
          {t("common.loanAmountDue")}{" "}
          <span className="hight-light">10.000.000 đồng</span>{" "}
          {t("common.dueDate")} <span className="hight-light">dd/mm/yy</span>
        </p>
        <div className="dash-board-loan-box">
          <TotalLoan
            cardName="total-amount-borrowed1"
            title={t("common.totalAmountBorrowed")}
            amount="156.000.000 đồng"
          />
          <TotalLoan
            cardName="total-amount-borrowed2"
            title={t("common.monthlyPayment")}
            amount="5.500.000 đồng"
          />
          <TotalLoan
            cardName="total-amount-borrowed2"
            title={t("common.totalLoans")}
            amount="15 khoản vay"
          />
        </div>
        <div className="chart-info">
          <h2>{t("common.loanStatistics")}</h2>
          <p>{t("common.amountBorrowed")}</p>
          <p>15.000.000 đồng</p>
          <p>{t("common.totalAmountBorrowedInMonth")}</p>
          <StatisticalChart data1={data1} data2={data2} labels={labels} />
        </div>
      </MainLayout>
    </>
  );
};

const DashBoard = React.memo(DashBoardPage);
export default DashBoard;