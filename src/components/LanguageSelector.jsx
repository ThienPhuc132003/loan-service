import React from "react";
import { useTranslation } from "react-i18next";
import "../assets/css/LanguageSelector.style.css";
const LanguageSelectorComponent = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language">Language: </label>
      <select
        id="language"
        onChange={handleLanguageChange}
        value={i18n.language}
      >
        <option value="en">English</option>
        <option value="vi">Vietnamese</option>
      </select>
    </div>
  );
};
const LanguageSelector = React.memo(LanguageSelectorComponent);
export default LanguageSelector;
