// src/components/TotalLoan.jsx
import React from "react";
import PropTypes from "prop-types";
import "../assets/css/TotalLoan.style.css";

const TotalLoanComponent = ({ title, amount }) => {
  return (
    <div className="loan-card">
      <div className="loan-card-content">
        <h3 className="loan-card-title">
          <i className="fa-solid fa-sack-dollar"></i>
          {title}
        </h3>
        <p className="loan-card-amount">{amount}</p>
      </div>
    </div>
  );
};

TotalLoanComponent.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

const TotalLoan = React.memo(TotalLoanComponent);
export default TotalLoan;
