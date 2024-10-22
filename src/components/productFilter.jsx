import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFilter } from "../redux/ProductSlice";
import PropTypes from "prop-types";
import "../assets/css/filter.style.css";

const ProductFilterComponent = ({ options, onFilterChange, filterTitle = "" }) => {
  const dispatch = useDispatch();
  const selectedFilters = useSelector((state) => state.filters.selectedFilters);

  const handleCheckboxChange = (option) => {
    dispatch(toggleFilter(option));
    const updatedFilters = selectedFilters.includes(option)
      ? selectedFilters.filter((filter) => filter !== option)
      : [...selectedFilters, option];
    onFilterChange(updatedFilters);
  };

  return (
    <div className="category-filter">
      <h3>{filterTitle}</h3>
      {options.map((option) => (
        <div key={option} className="type-select">
          <input
            type="checkbox"
            id={option}
            checked={selectedFilters.includes(option)}
            onChange={() => handleCheckboxChange(option)}
            className="check-box"
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </div>
  );
};

ProductFilterComponent.propTypes = {
  options: PropTypes.array.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filterTitle: PropTypes.string,
};

const ProductFilter = React.memo(ProductFilterComponent);
export default ProductFilter;
