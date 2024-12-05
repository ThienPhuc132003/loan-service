import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfAssetTypes.style.css";
import Table from "../components/Table";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";

const ListOfAssetTypesPage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [data, setData] = useState([]);

  const currentPath = "/list-of-asset-types";
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
        console.log("An error occurred while fetching data");
      }
    };

    fetchData();
  }, []);

  const columns = [
    { title: "Mã loại tài sản", dataKey: "assetTypeId" },
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
  const childrenMiddleContentLower = (
    <>
      <div className="asset-types-content">
        <h2>Danh sách loại tài sản</h2>
        <Table columns={columns} data={data} />
        <p>Manage your loans here.</p>
      </div>
    </>
  );
  return (
    <MainLayout
      currentPath={currentPath}
      currentPage="Loan Management"
      childrenMiddleContentLower={childrenMiddleContentLower}
    >
      <h2>Chào mừng quay lại, {userInfo.fullname}</h2>
      <p>
        bạn có một khoản vay <span className="highlight">10.000.000 đồng</span>{" "}
        cần thanh toán vào ngày <span className="highlight">dd/mm/yy</span>
      </p>
      <div className="asset-types-loan-box">
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
    </MainLayout>
  );
};

export default React.memo(ListOfAssetTypesPage);
