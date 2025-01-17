// src/pages/ListOfEmployees.jsx
import React, { useCallback, useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfEmployees.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import FilterButton from "../components/FilterButton";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";
import EmployeeForm from "../components/EmployeeForm";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";

const ListOfEmployeesPage = () => {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("ACTIVE");
  const itemsPerPage = 6;
  const roleId = "ADMIN";
  const currentPath = "/employee-management";

  const fetchData = useCallback(
    async (filter = []) => {
      try {
        const query = {
          rpp: itemsPerPage,
          page: currentPage + 1,
        };

        if (searchQuery) {
          filter.push({
            key: "employeeId",
            operator: "like",
            value: searchQuery,
          });
        }

        const response = await Api({
          endpoint: "loan-service/employee/search",
          method: METHOD_TYPE.GET,
          query,
        });

        if (response.success === true) {
          setData(response.data.items);
          setTotalItems(response.data.total);
        } else {
          console.log("Failed to fetch data");
        }
      } catch (error) {
        console.log("An error occurred while fetching data");
      }
    },
    [currentPage, itemsPerPage, searchQuery]
  );

  useEffect(() => {
    fetchData();
  }, [roleId, currentPage, fetchData]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleDelete = async (employeeId) => {
    if (window.confirm(t("employee.confirmDelete"))) {
      try {
        const response = await Api({
          endpoint: `loan-service/employee/${employeeId}`,
          method: METHOD_TYPE.DELETE,
        });

        if (response.success) {
          fetchData(); // Refresh the data after deletion
        } else {
          console.log("Failed to delete employee");
        }
      } catch (error) {
        console.log("An error occurred while deleting employee");
      }
    }
  };

  const handleAddEmployee = () => {
    setModalMode("add");
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleView = (employee) => {
    setModalData(employee);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setModalData(employee);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalMode(null);
  };

  const handleSave = () => {
    fetchData(); // Refresh the data after saving
    setIsModalOpen(false);
    setModalData(null);
    setModalMode(null);
  };

  const handleApplyFilter = (filterValues) => {
    // Apply filter logic here
    console.log("Filter applied with values:", filterValues);
  };

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  const activeEmployees = data.filter(
    (employee) => employee.status === "ACTIVE"
  );
  const inactiveEmployees = data.filter(
    (employee) => employee.status === "INACTIVE"
  );

  const fields = [
    { key: "employeeId", label: t("employee.id") },
    { key: "employeeProfile.fullname", label: t("employee.name") },
    { key: "phoneNumber", label: t("employee.phone") },
    { key: "email", label: t("employee.email") },
    { key: "employeeProfile.identifyCardNumber", label: t("employee.idCard") },
    { key: "createAt", label: t("common.createdAt") },
    { key: "createBy", label: t("common.createdBy") },
  ];

  const columns = [
    { title: t("employee.id"), dataKey: "employeeId" },
    { title: t("employee.name"), dataKey: "employeeProfile.fullname" },
    { title: t("employee.phone"), dataKey: "phoneNumber" },
    { title: t("employee.email"), dataKey: "email" },
    {
      title: t("employee.idCard"),
      dataKey: "employeeProfile.identifyCardNumber",
    },
    {
      title: t("common.createdAt"),
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
    { title: t("common.createdBy"), dataKey: "createBy" },
  ];

  const childrenMiddleContentLower = (
    <>
      <div className="employees-content">
        <h2>{t("employee.listTitle")}</h2>
        <div className="employees-search-filter">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            searchBarClassName="employee-search"
            searchInputClassName="employee-search-input"
            placeholder={t("employee.searchPlaceholder")}
          />
          <div className="filter-add-employee">
            <button className="add-employee-button" onClick={handleAddEmployee}>
              {t("employee.addButton")}
            </button>
            <FilterButton fields={fields} onApply={handleApplyFilter} />
          </div>
        </div>
        <div className="status-buttons">
          <button
            className={`status-button ${
              currentStatus === "ACTIVE" ? "active" : ""
            }`}
            onClick={() => setCurrentStatus("ACTIVE")}
          >
            {t("employee.active")}
          </button>
          <button
            className={`status-button ${
              currentStatus === "INACTIVE" ? "active" : ""
            }`}
            onClick={() => setCurrentStatus("INACTIVE")}
          >
            {t("employee.inactive")}
          </button>
        </div>
        {currentStatus === "ACTIVE" ? (
          <>
            <Table
              columns={columns}
              data={activeEmployees}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={(employee) => handleDelete(employee.employeeId)}
              pageCount={pageCount}
              onPageChange={handlePageClick}
            />
          </>
        ) : inactiveEmployees.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={inactiveEmployees}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={(employee) => handleDelete(employee.employeeId)}
              pageCount={pageCount}
              onPageChange={handlePageClick}
            />
          </>
        ) : (
          <p>{t("employee.noInactiveData")}</p>
        )}
      </div>
    </>
  );

  return (
    <MainLayout
      currentPath={currentPath}
      currentPage={t("employee.management")}
      childrenMiddleContentLower={childrenMiddleContentLower}
    >
      <div className="employees-loan-box">
        <TotalLoan
          cardName="total-amount-borrowed1"
          title={t("employee.total")}
          amount={`${data.length} ${t("employee.employees")}`}
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title={t("employee.totalInactive")}
          amount={`${inactiveEmployees.length} ${t("employee.employees")}`}
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title={t("employee.totalNew")}
          amount="10 nhân viên"
        />
      </div>

      {/* Employee Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <EmployeeForm
          mode={modalMode || "view"} // Ensure mode is never null
          employeeId={
            modalMode === "view" || modalMode === "edit"
              ? modalData.employeeId
              : null
          }
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </Modal>
    </MainLayout>
  );
};

const ListOfEmployees = React.memo(ListOfEmployeesPage);
export default ListOfEmployees;
