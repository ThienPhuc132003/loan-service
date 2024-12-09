// src/pages/ListOfCustomers.jsx
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfCustomers.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";

const ListOfCustomersPage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPath = "/list-of-customers";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api({
          endpoint: "loan-service/borrower",
          method: METHOD_TYPE.GET,
          query: { page: 1, rpp: 10 },
        });
        if (response.success === true) {
          setData(response.data.items);
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
      (item.borrowerId &&
        item.borrowerId.toLowerCase().includes(searchLower)) ||
      (item.name && item.name.toLowerCase().includes(searchLower)) ||
      (item.phoneNumber && item.phoneNumber.includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower)) ||
      (item.numberOfContracts &&
        item.numberOfContracts.toString().includes(searchLower)) ||
      (item.borrowerProfile.income &&
        item.borrowerProfile.income.toString().includes(searchLower)) ||
      (item.borrowerProfile.debtStatus &&
        item.borrowerProfile.debtStatus.toLowerCase().includes(searchLower)) ||
      (item.createAt && item.createAt.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { title: "Mã khách hàng", dataKey: "borrowerId" },
    { title: "Tên khách hàng", dataKey: "name" },
    { title: "Số điện thoại", dataKey: "phoneNumber" },
    { title: "Email", dataKey: "email" },
    { title: "Thu nhập", dataKey: "borrowerProfile.income" },
    {
      title: "Trạng thái",
      dataKey: "borrowerProfile.debtStatus",
      renderCell: (value) =>
        value === "GOOD" ? (
          <span className="status good">Tốt</span>
        ) : value === "BAD" ? (
          <span className="status bad">Nợ xấu</span>
        ) : (
          <span className="status unknow">chưa xác định</span>
        ),
    },
    { title: "Số hợp đồng", dataKey: "numberOfContracts" },
    { title: "Ngày đăng ký", dataKey: "createAt" },
  ];

  const childrenMiddleContentLower = (
    <>
      <div className="customers-content">
        <h2>Danh sách khách hàng</h2>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          searchBarClassName="customer-search"
          searchInputClassName="customer-search-input"
          placeholder="Tìm kiếm khách hàng"
        />
        <Table columns={columns} data={searchQuery ? filteredData : data} />
        <p>Manage your customers here.</p>
      </div>
    </>
  );

  return (
    <MainLayout
      currentPath={currentPath}
      currentPage="Customer Management"
      childrenMiddleContentLower={childrenMiddleContentLower}
    >
      <h2>Chào mừng quay lại, {userInfo.fullname}</h2>
      <p>
        bạn có một khoản vay <span className="highlight">10.000.000 đồng</span>{" "}
        cần thanh toán vào ngày <span className="highlight">dd/mm/yy</span>
      </p>
      <div className="customers-loan-box">
        <TotalLoan
          cardName="total-amount-borrowed1"
          title="Tổng số khách hàng"
          amount="1 khách hàng"
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title="Tổng khách hàng nợ xấu"
          amount="1 khách hàng"
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title="Tổng khách hàng mới"
          amount="0 khách hàng"
        />
      </div>
    </MainLayout>
  );
};

export default React.memo(ListOfCustomersPage);
