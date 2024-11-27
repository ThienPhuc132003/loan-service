// File: components/BankAccountInfo.jsx
import React from "react";
import "../assets/css/BankAccountInfo.style.css";
import { useSelector } from "react-redux";

const formatAccountNumber = (accountNumber) => {
  return accountNumber.replace(/(\d{4})(?=\d)/g, "$1-");
};
const BankAccountInfoComponent = () => {
  const userInfo = useSelector((state) => state.user.userProfile);
  const bankAccounts = userInfo?.bankAccounts || [];
  const defaultAccount = bankAccounts.find((acc) => acc.isDefault) || null;
  const otherAccounts = bankAccounts.filter((acc) => !acc.isDefault);

  return (
    <div className="bank-account-info">
      <div className="header">
        <h2 className="bank-account-title">Thông tin tài khoản ngân hàng</h2>
        <button className="edit-button">Chỉnh sửa</button>
      </div>

      {defaultAccount && (
        <div className="default-account">
          <h3 className="account-type">Tài khoản mặc định</h3>
          <div className="account-card">
            <p className="bank-name">{defaultAccount.bankName}</p>
            <p className="account-number">
              {formatAccountNumber(defaultAccount.accountNumber)}
            </p>
            <p className="account-owner">NGUYỄN VĂN AN</p>
          </div>
        </div>
      )}

      {otherAccounts.length > 0 && (
        <div className="other-accounts">
          <h3 className="account-type">Tài khoản khác</h3>
          {otherAccounts.map((account, index) => (
            <div className="account-card" key={index}>
              <p className="bank-name">{account.bankName}</p>
              <p className="account-number">
                {formatAccountNumber(account.accountNumber)}
              </p>
              <p className="account-owner">NGUYỄN VĂN AN</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BankAccountInfo = React.memo(BankAccountInfoComponent);
export default BankAccountInfo;
