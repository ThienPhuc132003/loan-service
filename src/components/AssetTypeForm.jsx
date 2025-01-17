import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { useTranslation } from "react-i18next";
import "../assets/css/AssetTypeForm.style.css";

const AssetTypeFormComponent = ({ mode, assetTypeId, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    assetTypeId: "",
    assetTypeName: "",
    status: "AVAILABLE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && assetTypeId) {
      setLoading(true);
      Api({
        endpoint: `loan-service/asset-type/${assetTypeId}`,
        method: METHOD_TYPE.GET,
      })
        .then((response) => {
          setFormData({
            assetTypeId: response.data.assetTypeId,
            assetTypeName: response.data.assetTypeName,
            status: response.data.status,
          });
        })
        .catch((error) => {
          console.error("Error fetching asset type data:", error);
          setError(t("assetType.fetchError"));
        })
        .finally(() => setLoading(false));
    }
  }, [mode, assetTypeId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setLoading(true);
    let updatedData;

    if (mode === "add") {
      updatedData = {
        assetTypeName: formData.assetTypeName,
      };
      Api({
        endpoint: "loan-service/asset-type",
        method: METHOD_TYPE.POST,
        data: updatedData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => setError(t("assetType.addError")))
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      updatedData = {
        assetTypeName: formData.assetTypeName,
        status: formData.status,
      };
      Api({
        endpoint: `loan-service/asset-type/${assetTypeId}`,
        method: METHOD_TYPE.PUT,
        data: updatedData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch((error) => {
          console.log("Update error:", error.message);
          setError(t("assetType.updateError"));
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return <div className="loading">{t("assetType.loading")}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="asset-type-form-container">
      <h2>
        {mode === "add"
          ? t("assetType.addTitle")
          : mode === "edit"
          ? t("assetType.editTitle")
          : t("assetType.viewTitle")}
      </h2>
      <div className="form-grid">
        <div className="form-group">
          <label>{t("assetType.assetTypeName")}</label>
          <input
            type="text"
            name="assetTypeName"
            value={formData.assetTypeName}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        {mode === "edit" && (
          <div className="form-group">
            <label>{t("assetType.status")}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="AVAILABLE">{t("assetType.available")}</option>
              <option value="UNAVAILABLE">{t("assetType.unavailable")}</option>
            </select>
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

AssetTypeFormComponent.propTypes = {
  mode: PropTypes.oneOf(["add", "edit", "view"]).isRequired,
  assetTypeId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AssetTypeFormComponent;