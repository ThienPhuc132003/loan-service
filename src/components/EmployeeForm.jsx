import { useState, useEffect } from "react";
import "../assets/css/EmployeeForm.style.css";
import PropTypes from "prop-types";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { useTranslation } from "react-i18next";

const EmployeeFormComponent = ({ mode, employeeId, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: "",
    phoneNumber: "",
    fullName: "",
    birthday: "",
    gender: "",
    identifyCardNumber: "",
    homeAddress: {
      houseNumberWithStreetWithWard: "",
      district: "",
      city: "",
    },
    roleId: "ACCOUNTANT",
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
          const data = response.data;
          setFormData({
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            fullName: data.employeeProfile?.fullname || "",
            birthday: data.employeeProfile?.birthday || "",
            gender: data.employeeProfile?.gender,
            identifyCardNumber: data.employeeProfile?.identifyCardNumber || "",
            homeAddress: {
              houseNumberWithStreetWithWard:
                data.employeeProfile?.homeAddress
                  ?.houseNumberWithStreetWithWard || "",
              district: data.employeeProfile?.homeAddress?.district || "",
              city: data.employeeProfile?.homeAddress?.city || "",
            },
            roleId: data.roleId || "",
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
    if (name.startsWith("homeAddress.")) {
      const addressField = name.split(".")[1];
      setFormData({
        ...formData,
        homeAddress: {
          ...formData.homeAddress,
          [addressField]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    setLoading(true);
    console.log("Data to be sent:", formData); // Log the data before sending
  
    const updatedData = {
      roleId: formData.roleId,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      fullname: formData.fullName,
      avatar: formData.avatar,
      identifyCardNumber: formData.identifyCardNumber,
      homeAddress: formData.homeAddress,
      birthday: formData.birthday,
      gender: formData.gender,
    };
  
    if (mode === "add") {
      // Call API to create a new employee
      Api({
        endpoint: "loan-service/employee",
        method: METHOD_TYPE.POST,
        data: updatedData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => {
          setError(t("employee.addError"));
        })
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      Api({
        endpoint: `loan-service/employee/${employeeId}`,
        method: METHOD_TYPE.PUT,
        data: updatedData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => {
          setError(t("employee.updateError"));
        })
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
          <label>{t("employee.phoneNumber")}</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
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
          <label>{t("employee.birthday")}</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.idCard")}</label>
          <input
            type="text"
            name="identifyCardNumber"
            value={formData.identifyCardNumber}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("employee.address")}</label>
          <input
            type="text"
            name="homeAddress.houseNumberWithStreetWithWard"
            value={formData.homeAddress.houseNumberWithStreetWithWard}
            onChange={handleChange}
            disabled={mode === "view"}
            placeholder={t("employee.houseNumberWithStreetWithWard")}
          />
          <input
            type="text"
            name="homeAddress.district"
            value={formData.homeAddress.district}
            onChange={handleChange}
            disabled={mode === "view"}
            placeholder={t("employee.district")}
          />
          <input
            type="text"
            name="homeAddress.city"
            value={formData.homeAddress.city}
            onChange={handleChange}
            disabled={mode === "view"}
            placeholder={t("employee.city")}
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
            <option value="APPRAISAL_STAFF">
              {t("employee.appraisalStaff")}
            </option>
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
  mode: PropTypes.oneOf(["add", "edit", "view"]).isRequired,
  employeeId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default EmployeeFormComponent;
