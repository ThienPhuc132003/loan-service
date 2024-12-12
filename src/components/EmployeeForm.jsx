import React, { useState, useEffect } from "react";
import axios from "axios";
import "../assets/css/EmployeeForm.style.css";
import PropTypes from "prop-types";
const EmployeeFormComponent = ({ mode, employeeId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    fullName: "",
    dob: "",
    gender: "Nam",
    idCard: "",
    address: "",
    role: "Nhân viên",
    createdDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data in "view" or "edit" mode
  useEffect(() => {
    if ((mode === "view" || mode === "edit") && employeeId) {
      setLoading(true);
      axios
        .get(`http://152.42.232.101:9005/api/v1/loan-service/employee/${employeeId}`)
        .then((response) => {
          const data = response.data.data;
          setFormData({
            username: data.employeeId || "",
            password: "", // Password is hidden in view/edit mode
            email: data.email || "",
            phone: data.phoneNumber || "",
            fullName: data.employeeProfile?.fullname || "",
            dob: data.employeeProfile?.birthday || "",
            gender: data.employeeProfile?.gender === "MALE" ? "Nam" : "Nữ",
            idCard: data.employeeProfile?.identifyCardNumber || "",
            address: data.employeeProfile?.homeAddress || "",
            role: data.roleId || "Nhân viên",
            createdDate: new Date(data.createAt).toLocaleDateString(),
          });
        })
        .catch(() => setError("Không thể tải thông tin nhân viên."))
        .finally(() => setLoading(false));
    }
  }, [mode, employeeId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);

    if (mode === "add") {
      // Call API to create a new employee
      axios
        .post("http://152.42.232.101:9005/api/v1/loan-service/employee", formData)
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => setError("Không thể thêm nhân viên."))
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      // Call API to update employee
      axios
        .put(`http://152.42.232.101:9005/api/v1/loan-service/employee/${employeeId}`, formData)
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => setError("Không thể cập nhật thông tin nhân viên."))
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return <div className="modal-overlay"><div className="modal-content">Đang tải...</div></div>;
  }

  if (error) {
    return <div className="modal-overlay"><div className="modal-content">{error}</div></div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {mode === "add"
            ? "Thêm nhân viên"
            : mode === "edit"
            ? "Chỉnh sửa thông tin nhân viên"
            : "Thông tin nhân viên"}
        </h2>
        <div className="form-group">
          <label>Mã tài khoản</label>
          <input type="text" value={formData.username} readOnly />
        </div>
        {mode === "add" && (
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>Họ tên</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>Ngày sinh</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>CCCD/CMND</label>
          <input
            type="text"
            name="idCard"
            value={formData.idCard}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>Giới tính</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={mode === "view"}
          >
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quyền</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            disabled={mode === "view"}
          >
            <option value="Nhân viên">Nhân viên</option>
            <option value="Kế toán">Kế toán</option>
            <option value="Quản trị viên">Quản trị viên</option>
          </select>
        </div>
        {mode === "view" && (
          <div className="form-group">
            <label>Ngày tạo</label>
            <input type="text" value={formData.createdDate} readOnly />
          </div>
        )}
        <div className="form-actions">
          {mode !== "view" && <button onClick={handleSubmit}>Lưu</button>}
          <button onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
};
EmployeeFormComponent.propTypes = {
  mode: PropTypes.oneOf(["add", "view", "edit"]).isRequired,
  employeeId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func,
};

const EmployeeForm = React.memo(EmployeeFormComponent);
export default EmployeeForm;
