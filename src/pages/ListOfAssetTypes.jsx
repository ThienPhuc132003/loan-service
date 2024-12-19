// src/pages/ListOfAssetTypes.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfAssetTypes.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";

const ListOfAssetTypesPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPath = "/asset-type-management";
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

  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.assetTypeId &&
        item.assetTypeId.toLowerCase().includes(searchLower)) ||
      (item.assetTypeName &&
        item.assetTypeName.toLowerCase().includes(searchLower)) ||
      (item.status && item.status.toLowerCase().includes(searchLower))
    );
  });

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
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          searchBarClassName="asset-type-search"
          searchInputClassName="asset-type-search-input"
          placeholder="Tìm kiếm loại tài sản"
        />
        <Table columns={columns} data={searchQuery ? filteredData : data} />
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
const ListOfAssetTypes = React.memo(ListOfAssetTypesPage);
export default ListOfAssetTypes;
