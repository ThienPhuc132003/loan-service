import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Table from "./Table";
import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";
import Modal from "./Modal";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import { useTranslation } from "react-i18next";

const ListContainer = ({
  endpoint,
  columns,
  fields,
  addButtonLabel,
  searchPlaceholder,
  filterPlaceholder,
  modalComponent: ModalComponent,
  modalProps,
  itemKey,
}) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [modalData, setModalData] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchData = useCallback(async (filter = []) => {
    try {
      const query = {
        rpp: itemsPerPage,
        page: currentPage + 1,
      };

      if (searchQuery) {
        filter.push({
          key: itemKey,
          operator: "like",
          value: searchQuery,
        });
      }

      Object.keys(filterValues).forEach((key) => {
        if (filterValues[key]) {
          filter.push({
            key,
            operator: "like",
            value: filterValues[key],
          });
        }
      });

      if (filter.length) {
        query.filter = JSON.stringify(filter);
      }

      console.log("Query:", query.filter);

      const response = await Api({
        endpoint,
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
  }, [currentPage, itemsPerPage, searchQuery, filterValues, endpoint, itemKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const handleApplyFilter = (values) => {
    setFilterValues(values);
    fetchData();
  };

  const handleAddItem = () => {
    setModalMode("add");
    setModalData(null);
    setIsModalOpen(true);
  };

  const handleView = (item) => {
    setModalData(item);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setModalData(item);
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

  const pageCount = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="list-container">
      <div className="list-header">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          searchBarClassName="list-search"
          searchInputClassName="list-search-input"
          placeholder={searchPlaceholder}
        />
        <div className="filter-add-buttons">
          <button className="add-button" onClick={handleAddItem}>
            {addButtonLabel}
          </button>
          <FilterButton fields={fields} onApply={handleApplyFilter} />
        </div>
      </div>
      <Table
        columns={columns}
        data={data}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={(item) => handleDelete(item[itemKey])}
        pageCount={pageCount}
        onPageChange={handlePageClick}
      />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ModalComponent
          mode={modalMode}
          data={modalData}
          onClose={handleCloseModal}
          onSave={handleSave}
          {...modalProps}
        />
      </Modal>
    </div>
  );
};

ListContainer.propTypes = {
  endpoint: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      dataKey: PropTypes.string.isRequired,
      renderCell: PropTypes.func,
    })
  ).isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  addButtonLabel: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  filterPlaceholder: PropTypes.string.isRequired,
  modalComponent: PropTypes.elementType.isRequired,
  modalProps: PropTypes.object,
  itemKey: PropTypes.string.isRequired,
};

export default ListContainer;