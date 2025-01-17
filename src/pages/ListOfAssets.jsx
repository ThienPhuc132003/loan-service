import React, { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import "../assets/css/ListOfAssets.style.css";
import Table from "../components/Table";
import SearchBar from "../components/SearchBar";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import TotalLoan from "../components/TotalLoan";
import AssetForm from "../components/AssetForm";
import { useTranslation } from "react-i18next";
import Modal from "../components/Modal";

const ListOfAssetsPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStatus, setCurrentStatus] = useState("AVAILABLE");
  const itemsPerPage = 5;
  const currentPath = "/asset-management";

  const fetchData = useCallback(async () => {
    try {
      const response = await Api({
        endpoint: "loan-service/asset",
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

  const handleAddAsset = () => {
    setModalMode("add");
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleView = (asset) => {
    setModalData(asset);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (asset) => {
    setModalData(asset);
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
      (item.assetId && item.assetId.toLowerCase().includes(searchLower)) ||
      (item.assetName && item.assetName.toLowerCase().includes(searchLower)) ||
      (item.assetType.assetTypeName &&
        item.assetType.assetTypeName.toLowerCase().includes(searchLower)) ||
      (item.status && item.status.toLowerCase().includes(searchLower))
    );
  });

  const columns = [
    { title: t("asset.assetId"), dataKey: "assetId" },
    { title: t("asset.assetName"), dataKey: "assetName" },
    { title: t("asset.assetTypeName"), dataKey: "assetType.assetTypeName" },
    {
      title: t("asset.status"),
      dataKey: "status",
      renderCell: (value) =>
        value === "UNAVAILABLE" ? (
          <span className="status deleted">{t("asset.unavailable")}</span>
        ) : (
          <span className="status active">{t("asset.available")}</span>
        ),
    },
  ];

  const activeAssets = filteredData.filter(
    (asset) => asset.status === "AVAILABLE"
  );
  const inactiveAssets = filteredData.filter(
    (asset) => asset.status === "UNAVAILABLE"
  );

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const childrenMiddleContentLower = (
    <>
      <div className="assets-content">
        <div className="list-header">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            searchBarClassName="asset-search"
            searchInputClassName="asset-search-input"
            placeholder={t("asset.searchPlaceholder")}
          />
          <div className="filter-add-buttons">
            <button className="add-asset-button" onClick={handleAddAsset}>
              {t("asset.addButton")}
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
            {t("asset.available")}
          </button>
          <button
            className={`status-button ${
              currentStatus === "UNAVAILABLE" ? "active" : ""
            }`}
            onClick={() => setCurrentStatus("UNAVAILABLE")}
          >
            {t("asset.unavailable")}
          </button>
        </div>
        {currentStatus === "AVAILABLE" ? (
          <>
            <Table
              columns={columns}
              data={paginatedData.filter(
                (asset) => asset.status === "AVAILABLE"
              )}
              onView={handleView}
              onEdit={handleEdit}
              pageCount={Math.ceil(activeAssets.length / itemsPerPage)}
              onPageChange={handlePageClick}
            />
          </>
        ) : inactiveAssets.length > 0 ? (
          <>
            <Table
              columns={columns}
              data={paginatedData.filter(
                (asset) => asset.status === "UNAVAILABLE"
              )}
              onView={handleView}
              onEdit={handleEdit}
              pageCount={Math.ceil(inactiveAssets.length / itemsPerPage)}
              onPageChange={handlePageClick}
            />
          </>
        ) : (
          <p>{t("asset.noInactiveData")}</p>
        )}
      </div>
    </>
  );

  return (
    <MainLayout
      currentPath={currentPath}
      currentPage={t("asset.management")}
      childrenMiddleContentLower={childrenMiddleContentLower}
    >
      <div className="assets-loan-box">
        <TotalLoan
          cardName="total-amount-borrowed1"
          title={t("asset.total")}
          amount={`${data.length} ${t("asset.assets")}`}
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title={t("asset.totalAvailable")}
          amount={`${activeAssets.length} ${t("asset.assets")}`}
        />
        <TotalLoan
          cardName="total-amount-borrowed2"
          title={t("asset.totalUnavailable")}
          amount={`${inactiveAssets.length} ${t("asset.assets")}`}
        />
      </div>

      {/* Asset Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AssetForm
          mode={modalMode}
          assetId={
            modalMode === "view" || modalMode === "edit"
              ? modalData.assetId
              : null
          }
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      </Modal>
    </MainLayout>
  );
};

const ListOfAssets = React.memo(ListOfAssetsPage);
export default ListOfAssets;