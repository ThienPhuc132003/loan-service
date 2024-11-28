import React, { useState, useCallback, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { setUserProfile } from "../redux/userSlice";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUsername && savedPassword && savedRememberMe) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(savedRememberMe);
    }
  }, []);

  const validateFields = useCallback(() => {
    const errors = {};
    if (username === "") {
      errors.username = t("login.emptyEmail");
    }
    if (password === "") {
      errors.password = t("login.emptyPassword");
    }
    if (!captchaValue) errors.captcha = t("common.captchaNotVerified");
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
        endpoint: "loan-service/borrower/login",
        method: METHOD_TYPE.POST,
        data: {
          emailOrPhoneNumber: username,
          password: password,
        },
      });
      const token = response.data.token;
      if (token) {
        Cookies.set("token", token);
        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
          localStorage.removeItem("rememberMe");
        }

        const userProfileResponse = await Api({
          endpoint: "loan-service/borrower/get-profile",
          method: METHOD_TYPE.GET,
        });

        dispatch(setUserProfile(userProfileResponse.data));
        navigate("/main-page");
      }
    } catch (error) {
      setErrorMessages({ login: t("login.error") });
    }
  }, [navigate, username, password, rememberMe, validateFields, t, dispatch]);

  const handleForgotPassword = useCallback(() => {
    navigate("/forgot-password");
  }, [navigate]);

  const handleRegister = useCallback(() => {
    navigate("/register");
  }, [navigate]);

  const handleUsernameChange = useCallback(
    (e) => {
      const value = e.target.value;
      setUsername(value);
      if (errorMessages.username || errorMessages.login) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          username: "",
          login: prevErrors.login ? "" : prevErrors.login,
        }));
      }
    },
    [errorMessages.username, errorMessages.login]
  );

  const handlePasswordChange = useCallback(
    (e) => {
      const value = e.target.value;
      setPassword(value);
      if (errorMessages.password || errorMessages.login) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          password: "",
          login: prevErrors.login ? "" : prevErrors.login,
        }));
      }
    },
    [errorMessages.password, errorMessages.login]
  );

  const handleCaptchaChange = useCallback((value) => {
    setCaptchaValue(value);
  }, []);

  const handleRememberMeChange = useCallback((e) => {
    setRememberMe(e.target.checked);
  }, []);

  return (
    <div className="page-box">
      <LoginLayout>
        <div className="loginFormBox">
          <div id="loginForm" className="loginForm">
            <div className="language-box">
              <LanguageSelector />
            </div>
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
              <span>{t("common.or")}</span>
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
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={handleRememberMeChange}
              />
              <div htmlFor="rememberMe">{t("login.rememberMe")}</div>
            </div>
            <p className="error">{errorMessages.login}</p>
            <div className="submit-cancel">
              <Button className="submit" onClick={handleLogin}>
                {t("login.button")}
              </Button>
              <Button className="cancel">{t("common:cancel")}</Button>
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
  );
};
const Login = React.memo(LoginPage)
export default Login;