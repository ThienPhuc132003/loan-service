import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginLayout from "../components/layout/LoginLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import LanguageSelector from "../components/LanguageSelector";

function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrPhone, otp } = location.state || {};
  const { t } = useTranslation();

  const validateFields = useCallback(() => {
    const errors = {};
    if (password === "") {
      errors.password = t("signup.emptyPassword");
    }
    if (confirmPassword === "") {
      errors.confirmPassword = t("signup.emptyConfirmPassword");
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = t("signup.passwordNotMatch");
    }
    return errors;
  }, [password, confirmPassword, t]);

  const handleChangePassword = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await Api({
        endpoint: "http://152.42.232.101:7000/borrower/reset-password",
        method: METHOD_TYPE.POST,
        data: {
          email: emailOrPhone,
          otp: otp,
          newPassword: password,
          confirmPassword: confirmPassword,
        },
      });
      if (response.success === true) {
        navigate("/login");
      } else {
        setErrorMessages({ password: t("signup.error") });
      }
    } catch (error) {
      setErrorMessages({ password: t("signup.error") });
    }
  }, [
    password,
    confirmPassword,
    emailOrPhone,
    otp,
    validateFields,
    navigate,
    t,
  ]);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleBackPage = () => {
    navigate("/otp-verify");
  };
  return (
    <>
      <div className="page-box">
        <LoginLayout>
          <div className="loginFormBox">
            <div id="loginForm" className="loginForm">
              <LanguageSelector />
              <h1 className="FormName">{t("signup.changePassword")}</h1>
              <p className="description">{t("signup.enterNewPassword")}</p>
              <InputField
                type="password"
                id="password"
                value={password}
                placeholder={t("signup.newPassword")}
                errorMessage={errorMessages.password}
                onChange={handlePasswordChange}
                className={
                  errorMessages.password ? "error-border" : "correct-border"
                }
              />
              <InputField
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder={t("signup.confirmPasswordPlaceholder")}
                errorMessage={errorMessages.confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={
                  errorMessages.confirmPassword
                    ? "error-border"
                    : "correct-border"
                }
              />
              <p className="error">{errorMessages.password}</p>
              <p className="error">{errorMessages.confirmPassword}</p>
              <div className="submit-cancel">
                <Button className="submit" onClick={handleChangePassword}>
                  {t("signup.confirm")}
                </Button>
                <Button className="cancel" onClick={handleBackPage}>
                  {t("signup.cancel")}
                </Button>
              </div>
            </div>
          </div>
        </LoginLayout>
      </div>
    </>
  );
}

const ChangePassword = React.memo(ChangePasswordPage);
export default ChangePassword;
