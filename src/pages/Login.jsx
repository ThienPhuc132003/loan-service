import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/css/login.style.css";
import LoginLayout from "../components/layout/LoginLayout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import logoFb from "../assets/images/logoFb.png";
import logoGoogle from "../assets/images/logoGoogle.png";
import LanguageSelector from "../components/LanguageSelector";
import ReCAPTCHA from "react-google-recaptcha";

function HandleLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateFields = useCallback(() => {
    const errors = {};
    if (username === "") {
      errors.username = t("login.emptyEmail");
    }
    if (password === "") {
      errors.password = t("login.emptyPassword");
    }
    if (!captchaValue) errors.captcha = t("signup.captchaNotVerified"); 
    return errors;
  }, [username, password, captchaValue, t]);

  const handleLogin = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const response = await Api({
        endpoint: "http://152.42.232.101:7000/borrower/login",
        method: METHOD_TYPE.POST,
        data: {
          emailOrPhoneNumber: username,
          password: password,
        },
      });
      const token = response.data.token;
      if (token) {
        Cookies.set("token", token);
        navigate("/main-page");
      }
    } catch (error) {
      setErrorMessages({ login: t("login.error") });
    }
  }, [navigate, username, password, validateFields, t]);

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    if (errorMessages.username || errorMessages.login) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        username: "",
        login: prevErrors.login ? "" : prevErrors.login,
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (errorMessages.password || errorMessages.login) {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        password: "",
        login: prevErrors.login ? "" : prevErrors.login,
      }));
    }
  };

  const handleCaptchaChange = (value) => {
    setCaptchaValue(value); 
  };

  return (
    <>
    <div className="page-box">
      <LoginLayout>
        <div className="loginFormBox">
          <div id="loginForm" className="loginForm">
            <LanguageSelector />
            <h1 className="FormName">{t("login.title")}</h1>
            <p className="description">{t("login.subtitle")}</p>
            <div className="other-login">
              <div className="login-option">
                <img src={logoGoogle} alt="User" className="login-img" />
                Google
              </div>
              <div className="login-option">
                <img src={logoFb} alt="User" className="login-img" />
                Facebook
              </div>
            </div>
            <div className="divider">
              <span>{t("login.or")}</span>
            </div>
            <div className="field">
              <label htmlFor="username">
                {t("login.emailOrPhone")}
                <span style={{ color: "red" }}> *</span>
              </label>
              <InputField
                type="text"
                id="username"
                value={username}
                placeholder={t("login.emailOrPhonePlaceholder")}
                errorMessage={errorMessages.username || errorMessages.login}
                onChange={handleUsernameChange}
                className={
                  errorMessages.username || errorMessages.login
                    ? "error-border"
                    : "correct-border"
                }
              />
            </div>
            <div className="field">
              <label htmlFor="password">
                {t("login.password")}
                <span style={{ color: "red" }}> *</span>
              </label>
              <InputField
                type="password"
                id="password"
                value={password}
                placeholder={t("login.passwordPlaceholder")}
                errorMessage={errorMessages.password || errorMessages.login}
                onChange={handlePasswordChange}
                className={
                  errorMessages.password || errorMessages.login
                    ? "error-border"
                    : "correct-border"
                }
              />
            </div>
            <div className="captcha-box">
              <label htmlFor="captcha" className="captcha-title">
                Captcha<span style={{ color: "red" }}> *</span>
              </label>
              <ReCAPTCHA
                sitekey="6Ldws3QqAAAAAMX5jNVnZPksWQRvMrp06k7uSbqz"
                onChange={handleCaptchaChange}
              />
              <p className="error">{errorMessages.captcha}</p>
            </div>
            <p className="error">{errorMessages.login}</p>
            <div className="submit-cancel">
              <Button className="submit" onClick={handleLogin}>
                {t("login.button")}
              </Button>
              <Button className="cancel">{t("login.cancel")}</Button>
            </div>
            <span className="forgot-password" onClick={handleForgotPassword}>
              {t("login.forgotPassword")}
            </span>
            <p className="register">
              {t("login.noAccount")}&nbsp;
              <span className="register-link" onClick={handleRegister}>
                {t("login.signup")}
              </span>
            </p>
          </div>
        </div>
      </LoginLayout>
      </div>
    </>
  );
}

const LoginPage = React.memo(HandleLoginPage);
export default LoginPage;
