import React, { useState, useEffect } from "react";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";

const BankDropdownPage = () => {
  const [banks, setBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState("");

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await Api({
          endpoint: "static-data/bank", 
          method: METHOD_TYPE.GET,
        });
        if (response.success) {
          setBanks(response.data);
        } else {
          console.error("Failed to fetch banks:", response.message);
        }
      } catch (error) {
        console.error("Error fetching banks:", error);
      }
    };

    fetchBanks();
  }, []);

  const handleChange = (event) => {
    setSelectedBank(event.target.value);
  };

  return (
    <div>
      <label htmlFor="bankDropdown">Chọn ngân hàng:</label>
      <select id="bankDropdown" value={selectedBank} onChange={handleChange}>
        <option value="">Chọn ngân hàng</option>
        {banks.map((bank) => (
          <option key={bank.bankId} value={bank.bankId}>
            {bank.vn_name}
          </option>
        ))}
      </select>
    </div>
  );
};
const BankDropdown = React.memo(BankDropdownPage);
export default BankDropdown;
