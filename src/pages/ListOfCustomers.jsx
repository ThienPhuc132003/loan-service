// src/pages/ListOfCustomers.jsx
import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfCustomers.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import numeral from "numeral";
import axios from "axios";

const ListOfCustomersPage = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { i18n } = useTranslation();
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/VND"
        );
        setExchangeRate(response.data.rates.USD);
      } catch (error) {
        console.error("Failed to fetch exchange rate:", error);
      }
    };

    if (i18n.language === "en") {
      fetchExchangeRate();
    }
  }, [i18n.language]);
  const currentPath = "/borrower-management";
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
    {
      title: "Thu nhập",
      dataKey: "borrowerProfile.income",
      renderCell: (value) => {
        const incomeInUSD = value * exchangeRate;
        return i18n.language === "vi"
          ? numeral(value).format("0,0") + " VND"
          : numeral(incomeInUSD).format("$0,0");
      },
    },
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
    {
      title: "Ngày đăng ký",
      dataKey: "createAt",
      renderCell: (value) => {
        const timeZone =
          i18n.language === "vi" ? "Asia/Ho_Chi_Minh" : "America/New_York";
        return formatInTimeZone(
          new Date(value),
          timeZone,
          "yyyy-MM-dd HH:mm:ssXXX"
        );
      },
    },
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
