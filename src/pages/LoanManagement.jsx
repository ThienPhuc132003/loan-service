import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/LoanManagement.style.css";
import Table from "../components/Table";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";
const LoanManagementPage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [data, setData] = useState([]);

  const currentPath = "loan-management";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api({
          endpoint: "loan-service/asset-type",
          method: METHOD_TYPE.GET,
        });
        if (response.success === true) {
          setData(response.data);
        } else {
          console.log("Failed to fetch data");
        }
      } catch (error) {
        console.log("An error occurred while fetching dataaaaa");
      }
    };

    fetchData();
  }, []);
  const columns = [
    { title: "Mã tài sản", dataKey: "assetTypeId" },
    { title: "Tên loại tài sản", dataKey: "assetTypeName" },
    {
      title: "Trạng thái",
      dataKey: "status",
      renderCell: (value) =>
        value === "UNAVAILABLE" ? (
          <span className="status deleted">Unavailable</span>
        ) : (
          <span className="status active">Available</span>
        ),
    },
  ];

  // const data = [
  //   { assetCode: "LTS001", assetName: "Loại 1", status: "UNAVAILABLE" },
  //   { assetCode: "LTS002", assetName: "Loại 2", status: "AVAILABLE" },
  //   { assetCode: "LTS003", assetName: "Loại 3", status: "AVAILABLE" },
  // ];
  const rightContent = <div style={{ width: '100%', height: '100%' }}></div>;
  return (
    <MainLayout currentPath={currentPath} currentPage="Loan Management" rightChildren={rightContent}>
      <div className="loan-management-container">
        <h2>Loan Management</h2>
        <p>Welcome, {userInfo.fullname}</p>
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
        <div className="loan-management-content">
        <h2>Danh sách loại tài sản</h2>
          <Table
            columns={columns}
            data={data}
            // onView={handleView}
            // onEdit={handleEdit}
            // onDelete={handleDelete}
          />
          <p>Manage your loans here.</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default React.memo(LoanManagementPage);
