import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfEmployees.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";
import EmployeeModal from "../components/EmployeeForm";
import { useSelector } from "react-redux";

const ListOfEmployeesPage = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null); 
  const [modalMode, setModalMode] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const roleId = "ADMIN";

  const currentPath = "/list-of-employees";

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api({
          endpoint: `loan-service/employee/by-role/ADMIN?filter=[{"key":"email","operator":"equal","value":"22521405@gm.uit.edu.vn"}]&sort=[{"key":"createAt","type":"DESC"}]&rpp=10&page=1`,
          method: METHOD_TYPE.GET,
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
  }, [roleId]);

  // Search filter
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.employeeId &&
        item.employeeId.toLowerCase().includes(searchLower)) ||
      (item.employeeProfile.fullname &&
        item.employeeProfile.fullname.toLowerCase().includes(searchLower)) ||
      (item.phoneNumber && item.phoneNumber.includes(searchLower)) ||
      (item.email && item.email.toLowerCase().includes(searchLower)) ||
      (item.employeeProfile.identifyCardNumber &&
        item.employeeProfile.identifyCardNumber.includes(searchLower)) ||
      (item.status && item.status.toLowerCase().includes(searchLower)) ||
      (item.createAt && item.createAt.toLowerCase().includes(searchLower))
    );
  });

  // Table columns
  const columns = [
    { title: "Mã nhân viên", dataKey: "employeeId" },
    { title: "Tên nhân viên", dataKey: "employeeProfile.fullname" },
    { title: "Số điện thoại", dataKey: "phoneNumber" },
    { title: "Email", dataKey: "email" },
    { title: "CCCD", dataKey: "employeeProfile.identifyCardNumber" },
    {
      title: "Trạng thái",
      dataKey: "status",
      renderCell: (value) =>
        value === "ACTIVE" ? (
          <span className="status active">Đang hoạt động</span>
        ) : (
          <span className="status unactive">Available</span>
        ),
    },
    { title: "Ngày lập", dataKey: "createAt" },
    { title: "Người lập", dataKey: "createBy" },
  ];

  // Handlers for table actions
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

  const handleDelete = (employee) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      console.log("Deleting employee:", employee);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setModalMode(null);
  };

  const handleSave = () => {
    console.log("Saved successfully!");
    setIsModalOpen(false);
    setModalData(null);
    setModalMode(null);
  };

  const childrenMiddleContentLower = (
    <>
      <div className="employees-content">
        <h2>Danh sách nhân viên</h2>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          searchBarClassName="employee-search"
          searchInputClassName="employee-search-input"
          placeholder="Tìm kiếm nhân viên"
        />
        <Table
          columns={columns}
          data={searchQuery ? filteredData : data}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </>
  );

  return (
    <MainLayout
      currentPath={currentPath}
      currentPage="Employee Management"
      childrenMiddleContentLower={childrenMiddleContentLower}
    >
      <h2>Chào mừng quay lại, {userInfo.fullname}</h2>
      <p>
        bạn có một khoản vay <span className="highlight">10.000.000 đồng</span>{" "}
        cần thanh toán vào ngày <span className="highlight">dd/mm/yy</span>
      </p>
      <div className="employees-loan-box">
        <TotalLoan
          cardName="total-amount-borrowed1"
          title="Tổng nhân viên"
          amount="3 nhân viên"
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title="Tổng nhân viên bị khóa"
          amount="1 nhân viên"
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title="Tổng nhân viên mới"
          amount="10 nhân viên"
        />
      </div>

      {/* Employee Modal */}
      {isModalOpen && (
        <EmployeeModal
          mode={modalMode}
          employeeId={modalMode === "view" || modalMode === "edit" ? modalData.employeeId : null}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </MainLayout>
  );
};

const ListOfEmployees = React.memo(ListOfEmployeesPage);
export default ListOfEmployees;
