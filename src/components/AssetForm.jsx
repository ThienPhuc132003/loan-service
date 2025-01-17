import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { useTranslation } from "react-i18next";
import "../assets/css/AssetForm.style.css";

const AssetFormComponent = ({ mode, assetId, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    assetTypeId: "",
    assetName: "",
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if ((mode === "view" || mode === "edit") && assetId) {
      setLoading(true);
      Api({
        endpoint: `loan-service/asset/${assetId}`,
        method: METHOD_TYPE.GET,
      })
        .then((response) => {
          setFormData({
            assetTypeId: response.data.assetTypeId,
            assetName: response.data.assetName,
            status: response.data.status,
          });
        })
        .catch((error) => {
          console.error("Error fetching asset data:", error);
          setError(t("asset.fetchError"));
        })
        .finally(() => setLoading(false));
    }
  }, [mode, assetId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    setLoading(true);
    const updatedData = {
      assetTypeId: formData.assetTypeId,
      assetName: formData.assetName,
      status: formData.status,
    };

    if (mode === "add") {
      Api({
        endpoint: "loan-service/asset",
        method: METHOD_TYPE.POST,
        data: updatedData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch(() => setError(t("asset.addError")))
        .finally(() => setLoading(false));
    } else if (mode === "edit") {
      console.log("update data tét", updatedData)
      Api({
        endpoint: `loan-service/asset/${assetId}`,
        method: METHOD_TYPE.PUT,
        data: updatedData,
      })
        .then(() => {
          onSave();
          onClose();
        })
        .catch((error) => {
          console.log("Update error:", error.message);
          setError(t("asset.updateError"));
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return <div className="loading">{t("asset.loading")}</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="asset-form-container">
      <h2>
        {mode === "add"
          ? t("asset.addTitle")
          : mode === "edit"
          ? t("asset.editTitle")
          : t("asset.viewTitle")}
      </h2>
      <div className="form-grid">
        <div className="form-group">
          <label>{t("asset.assetTypeId")}</label>
          <input
            type="text"
            name="assetTypeId"
            value={formData.assetTypeId}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        <div className="form-group">
          <label>{t("asset.assetName")}</label>
          <input
            type="text"
            name="assetName"
            value={formData.assetName}
            onChange={handleChange}
            disabled={mode === "view"}
          />
        </div>
        {mode === "edit" && (
          <div className="form-group">
            <label>{t("asset.status")}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="AVAILABLE">{t("asset.available")}</option>
              <option value="UNAVAILABLE">{t("asset.unavailable")}</option>
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

AssetFormComponent.propTypes = {
  mode: PropTypes.oneOf(["add", "edit", "view"]).isRequired,
  assetId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default AssetFormComponent;