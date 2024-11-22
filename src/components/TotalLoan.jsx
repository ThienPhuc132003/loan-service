// src/components/TotalLoan.jsx
import React from "react";
import PropTypes from "prop-types";
import "../assets/css/TotalLoan.style.css";

const TotalLoanComponent = ({ title, amount, cardName }) => {
  return (
    <div className={cardName}>
      <i className="fa-solid fa-sack-dollar"></i>
      <div className="loan-card-content">
        <h3 className="loan-card-title">{title}</h3>
        <p className="loan-card-amount">{amount}</p>
      </div>
    </div>
  );
};

TotalLoanComponent.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
  cardName: PropTypes.string,
};

const TotalLoan = React.memo(TotalLoanComponent);
export default TotalLoan;
