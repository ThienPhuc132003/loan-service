import React, { useState, useEffect } from "react";
import "../assets/css/EmployeeForm.style.css";
import PropTypes from "prop-types";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { useTranslation } from "react-i18next";

const EmployeeFormComponent = ({ mode, employeeId, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    fullName: "",
    dob: "",
    gender: "",
    idCard: "",
    address: "",
    roleId: "ACCOUNTANT",
    createdDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data in "view" or "edit" mode
  useEffect(() => {
    if ((mode === "view" || mode === "edit") && employeeId) {
      setLoading(true);
      Api({
        endpoint: `loan-service/employee/${employeeId}`,
        method: METHOD_TYPE.GET,
      })
        .then((response) => {
          const data = response.data; // Updated to match the provided data structure
          setFormData({
            username: data.employeeId || "",
            password: "",
            email: data.email || "",
            phone: data.phoneNumber || "",
            fullName: data.employeeProfile?.fullname || "",
            dob: data.employeeProfile?.birthday || "",
            gender: data.employeeProfile?.gender === "MALE" ? t("employee.male") : t("employee.female"),
            idCard: data.employeeProfile?.identifyCardNumber || "",
            address: data.employeeProfile?.homeAddress || "",
            roleId: data.roleId || "",
            createdDate: new Date(data.createAt).toLocaleDateString(),
          });
        })
        .catch((error) => {
          console.error("Error fetching employee data:", error);
          setError(t("employee.fetchError"));
        })
        .finally(() => setLoading(false));
    }
  }, [mode, employeeId, t]);

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
      Api({
        endpoint: "loan-service/employee",
        method: METHOD_TYPE.POST,
        data: formData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => setError(t("employee.addError")))
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      // Call API to update employee
      Api({
        endpoint: `loan-service/employee/${employeeId}`,
        method: METHOD_TYPE.PUT,
        data: formData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => setError(t("employee.updateError")))
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return <div className="loading">{t("employee.loading")}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="employee-form-container">
      <h2>
        {mode === "add"
          ? t("employee.addTitle")
          : mode === "edit"
          ? t("employee.editTitle")
          : t("employee.viewTitle")}
      </h2>
      <div className="form-grid">
        {mode === "add" && (
          <div className="form-group">
            <label>{t("employee.password")}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t("employee.passwordPlaceholder")}
            />
          </div>
        )}
        <div className="form-group">
          <label>{t("employee.email")}</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.phone")}</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.fullName")}</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.dob")}</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.idCard")}</label>
          <input
            type="text"
            name="idCard"
            value={formData.idCard}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.address")}</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.gender")}</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            disabled={mode === "view"}
          >
            <option value="MALE">{t("employee.male")}</option>
            <option value="FEMALE">{t("employee.female")}</option>
          </select>
        </div>
        <div className="form-group">
          <label>{t("employee.role")}</label>
          <select
            name="roleId"
            value={formData.roleId}
            onChange={handleChange}
            disabled={mode === "view"}
          >
            <option value="CREDIT_BOARD">{t("employee.creditBoard")}</option>
            <option value="ACCOUNTANT">{t("employee.accountant")}</option>
            <option value="APPRAISAL_STAFF">{t("employee.appraisalStaff")}</option>
          </select>
        </div>
        {mode === "view" && (
          <div className="form-group">
            <label>{t("employee.createdDate")}</label>
            <input type="text" value={formData.createdDate} readOnly />
          </div>
        )}
      </div>
      <div className="form-actions">
        {mode !== "view" && (
          <button className="save-button" onClick={handleSubmit}>
            {t("common.save")}
          </button>
        )}
        <button className="close-button" onClick={onClose}>
          {t("common.close")}
        </button>
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