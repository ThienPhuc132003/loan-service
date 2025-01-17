import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfAssetTypes.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";
import AssetTypeForm from "../components/AssetTypeForm";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";

const ListOfAssetTypesPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("AVAILABLE");
  const itemsPerPage = 5;
  const currentPath = "/asset-type-management";

  const fetchData = useCallback(async () => {
    try {
      const response = await Api({
        endpoint: "loan-service/asset-type",
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleAddAssetType = () => {
    setModalMode("add");
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleView = (assetType) => {
    setModalData(assetType);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (assetType) => {
    setModalData(assetType);
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

  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (item.assetTypeId &&
        item.assetTypeId.toLowerCase().includes(searchLower)) ||
      (item.assetTypeName &&
        item.assetTypeName.toLowerCase().includes(searchLower)) ||
      (item.status && item.status.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { title: t("assetType.assetTypeId"), dataKey: "assetTypeId" },
    { title: t("assetType.assetTypeName"), dataKey: "assetTypeName" },
    {
      title: t("assetType.status"),
      dataKey: "status",
      renderCell: (value) =>
        value === "UNAVAILABLE" ? (
          <span className="status deleted">{t("assetType.unavailable")}</span>
        ) : (
          <span className="status active">{t("assetType.available")}</span>
        ),
    },
  ];

  const activeAssetTypes = filteredData.filter(
    (assetType) => assetType.status === "AVAILABLE"
  );
  const inactiveAssetTypes = filteredData.filter(
    (assetType) => assetType.status === "UNAVAILABLE"
  );

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const childrenMiddleContentLower = (
    <>
      <div className="asset-types-content">
        <div className="list-header">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            searchBarClassName="asset-type-search"
            searchInputClassName="asset-type-search-input"
            placeholder={t("assetType.searchPlaceholder")}
          />
          <div className="filter-add-buttons">
            <button className="add-asset-type-button" onClick={handleAddAssetType}>
              {t("assetType.addButton")}
            </button>
          </div>
        </div>
        <div className="status-buttons">
          <button
            className={`status-button ${
              currentStatus === "AVAILABLE" ? "active" : ""
            }`}
            onClick={() => setCurrentStatus("AVAILABLE")}
          >
            {t("assetType.available")}
          </button>
          <button
            className={`status-button ${
              currentStatus === "UNAVAILABLE" ? "active" : ""
            }`}
            onClick={() => setCurrentStatus("UNAVAILABLE")}
          >
            {t("assetType.unavailable")}
          </button>
        </div>
        {currentStatus === "AVAILABLE" ? (
          <>
            <Table
              columns={columns}
              data={paginatedData.filter(
                (assetType) => assetType.status === "AVAILABLE"
              )}
              onView={handleView}
              onEdit={handleEdit}
              pageCount={Math.ceil(activeAssetTypes.length / itemsPerPage)}
              onPageChange={handlePageClick}
            />
          </>
        ) : inactiveAssetTypes.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={paginatedData.filter(
                (assetType) => assetType.status === "UNAVAILABLE"
              )}
              onView={handleView}
              onEdit={handleEdit}
              pageCount={Math.ceil(inactiveAssetTypes.length / itemsPerPage)}
              onPageChange={handlePageClick}
            />
          </>
        ) : (
          <p>{t("assetType.noInactiveData")}</p>
        )}
      </div>
    </>
  );

  return (
    <MainLayout
      currentPath={currentPath}
      currentPage={t("assetType.management")}
      childrenMiddleContentLower={childrenMiddleContentLower}
    >
      <div className="asset-types-loan-box">
        <TotalLoan
          cardName="total-amount-borrowed1"
          title={t("assetType.total")}
          amount={`${data.length} ${t("assetType.assetTypes")}`}
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title={t("assetType.totalAvailable")}
          amount={`${activeAssetTypes.length} ${t("assetType.assetTypes")}`}
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title={t("assetType.totalUnavailable")}
          amount={`${inactiveAssetTypes.length} ${t("assetType.assetTypes")}`}
        />
      </div>

      {/* Asset Type Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AssetTypeForm
          mode={modalMode}
          assetTypeId={
            modalMode === "view" || modalMode === "edit"
              ? modalData.assetTypeId
              : null
          }
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </Modal>
    </MainLayout>
  );
};

const ListOfAssetTypes = React.memo(ListOfAssetTypesPage);
export default ListOfAssetTypes;