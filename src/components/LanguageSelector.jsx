import React,{ useEffect } from "react";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { US, VN } from 'country-flag-icons/react/3x2';

const LanguageSelectorComponent = () => {
  const { i18n } = useTranslation();

  const languageOptions = [
    {
      value: "en",
      label: <US title="United States" style={{ width: '20px', height: '15px' }} />,
    },
    {
      value: "vi",
      label: <VN title="Vietnam" style={{ width: '20px', height: '15px' }} />,
    },
  ];

  const handleLanguageChange = (selectedOption) => {
    i18n.changeLanguage(selectedOption.value);
    localStorage.setItem("language", selectedOption.value);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  return (
    <Select
      options={languageOptions}
      onChange={handleLanguageChange}
      value={languageOptions.find(option => option.value === i18n.language)}
      className="language-selector"
      isSearchable={false} 
    />
  );
};

export default React.memo(LanguageSelectorComponent);