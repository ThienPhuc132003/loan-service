// src/pages/ListOfAssets.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfAssets.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";

const ListOfAssetsPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPath = "/asset-management";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api({
          endpoint: "loan-service/asset",
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
      (item.assetId && item.assetId.toLowerCase().includes(searchLower)) ||
      (item.assetName && item.assetName.toLowerCase().includes(searchLower)) ||
      (item.assetType.assetTypeName &&
        item.assetType.assetTypeName.toLowerCase().includes(searchLower)) ||
      (item.status && item.status.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { title: "Mã tài sản", dataKey: "assetId" },
    { title: "Tên tài sản", dataKey: "assetName" },
    { title: "Tên loại tài sản", dataKey: "assetType.assetTypeName" },
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
      <div className="assets-content">
        <h2>Danh sách tài sản</h2>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          searchBarClassName="asset-search"
          searchInputClassName="asset-search-input"
          placeholder="Tìm kiếm tài sản"
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
      <div className="assets-loan-box">
        <TotalLoan
          cardName="total-amount-borrowed1"
          title="Tổng tài sản"
          amount="3 tài sản"
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title="Tổng số tài sản đang dùng"
          amount="2 tài sản"
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
const ListOfAssets = React.memo(ListOfAssetsPage);
export default ListOfAssets;
