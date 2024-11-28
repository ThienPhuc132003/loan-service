// File: components/Table.jsx
import React from "react";
import PropTypes from "prop-types";
import "../assets/css/Table.style.css";
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};
const TableComponent = ({ columns, data, onView, onEdit, onDelete }) => {
  return (
    <div className="table-container">
      <table className="custom-table">
        {/* Table Header */}
        <thead>
          <tr className="table-header">
            {columns.map((col, index) => (
              <th key={index}>{col.title}</th>
            ))}
            <th>Hành động</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={rowIndex % 2 === 0 ? "row-even" : "row-odd"}
            >
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                   {col.renderCell
                    ? col.renderCell(getNestedValue(row, col.dataKey), row)
                    : getNestedValue(row, col.dataKey)}
                </td>
              ))}

              {/* Action Buttons */}
              <td className="action-buttons">
                <button
                  onClick={() => onView(row)}
                  title="Xem"
                  className="action-button view"
                >
                  <i className="fas fa-eye"></i>
                </button>
                <button
                  onClick={() => onDelete(row)}
                  title="Xóa"
                  className="action-button delete"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
                <button
                  onClick={() => onEdit(row)}
                  title="Chỉnh sửa"
                  className="action-button edit"
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TableComponent.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired, 
      dataKey: PropTypes.string.isRequired, 
      renderCell: PropTypes.func, 
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};


const Table = React.memo(TableComponent);
export default Table;
