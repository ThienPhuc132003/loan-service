import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginLayout from "../components/layout/LoginLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import LanguageSelector from "../components/LanguageSelector";

function ForgotPasswordPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateFields = useCallback(() => {
    const errors = {};
    if (emailOrPhone === "") {
      errors.email = t("login.emptyEmail");
    }
    return errors;
  }, [emailOrPhone, t]);

  const handleForgotPassword = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await Api({
        endpoint: "loan-service/borrower/forgot-password",
        method: METHOD_TYPE.POST,
        data: { emailOrPhoneNumber: emailOrPhone },
      });
      if (response.success === true) {
        navigate("/otp-verify", { state: { emailOrPhone } });
      } else {
        setErrorMessages({ email: t("login.emailNotFound") });
      }
    } catch (error) {
      setErrorMessages({ email: t("login.error") });
    }
  }, [emailOrPhone, validateFields, navigate, t]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmailOrPhone(value);
    if (errorMessages.email) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const handleBackPage = () => {
    navigate("/login");
  };

  return (
    <div className="page-box">
      <LoginLayout>
        <div className="loginFormBox">
          <div id="loginForm" className="loginForm">
            <div className="language-box">
              <LanguageSelector />
            </div>
            <h1 className="FormName">{t("login.forgotPasswordTitle")}</h1>
            <p className="description">{t("login.forgotPasswordSubtitle")}</p>
            <InputField
              type="email"
              id="email"
              value={emailOrPhone}
              placeholder={t("login.emailOrPhonePlaceholder")}
              errorMessage={errorMessages.email}
              onChange={handleEmailChange}
              className={
                errorMessages.email ? "error-border" : "correct-border"
              }
            />
            <p className="error">{errorMessages.email}</p>
            <div className="submit-cancel">
              <Button className="submit" onClick={handleForgotPassword}>
                {t("login.button")}
              </Button>
              <Button className="cancel" onClick={handleBackPage}>
                {t("common.cancel")}
              </Button>
            </div>
          </div>
        </div>
      </LoginLayout>
    </div>
  );
}

const ForgotPassword = React.memo(ForgotPasswordPage);
export default ForgotPassword;