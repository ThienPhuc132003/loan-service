import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LoginLayout from "../components/layout/LoginLayout";
import InputField from "../components/InputField";
import Button from "../components/Button";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import LanguageSelector from "../components/LanguageSelector";

function OtpVerifyPage() {
  const [otp, setOtp] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { emailOrPhone } = location.state || {};
  const { t } = useTranslation();

  const validateFields = useCallback(() => {
    const errors = {};
    if (otp === "") {
      errors.otp = t("signup.emptyOtp");
    }
    return errors;
  }, [otp, t]);

  const handleOtpVerification = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await Api({
        endpoint: "http://152.42.232.101:7000/borrower/verify-otp",
        method: METHOD_TYPE.POST,
        data: { otp: otp, email: emailOrPhone },
      });
      console.log("otp", response);
      if (response.success === true) {
        localStorage.setItem("otpVerified", "true");
        navigate("/change-password", { state: { emailOrPhone, otp } });
      } else {
        setErrorMessages({ otp: t("signup.invalidOtp") });
      }
    } catch (error) {
      setErrorMessages({ otp: t("signup.errorOtp") });
    }
  }, [otp, emailOrPhone, validateFields, navigate, t]);

  const handleOtpChange = (e) => {
    const value = e.target.value;
    setOtp(value);
    if (errorMessages.otp) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        otp: "",
      }));
    }
  };

  const handleBackPage = () => {
    navigate("/forgot-password");
  };

  return (
    <>
      <div className="page-box">
        <LoginLayout>
          <div className="loginFormBox">
            <div id="loginForm" className="loginForm">
              <LanguageSelector />
              <h1 className="FormName">{t("signup.verifyOtp")}</h1>
              <p className="description">{t("signup.enterOtpToVerify")}</p>
              <InputField
                type="text"
                id="otp"
                value={otp}
                placeholder="Otp"
                errorMessage={errorMessages.otp}
                onChange={handleOtpChange}
                className={
                  errorMessages.otp ? "error-border" : "correct-border"
                }
              />
              <p className="error">{errorMessages.otp}</p>
              <div className="submit-cancel">
                <Button className="submit" onClick={handleOtpVerification}>
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

const OtpVerify = React.memo(OtpVerifyPage);
export default OtpVerify;
