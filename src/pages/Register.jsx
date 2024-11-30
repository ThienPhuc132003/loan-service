import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/css/Register.style.css";
import LoginLayout from "../components/layout/LoginLayout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import logoFb from "../assets/images/logoFb.png";
import logoGoogle from "../assets/images/logoGoogle.png";
import RadioGroup from "../components/Radio";
import Cookies from "js-cookie";
import LanguageSelector from "../components/LanguageSelector";
import ReCAPTCHA from "react-google-recaptcha";
import { format } from "date-fns";
function HandleRegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [captchaValue, setCaptchaValue] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateFields = useCallback(() => {
    const errors = {};
    if (password === "") {
      errors.password = t("signup.emptyPassword");
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = t("signup.passwordNotMatch");
    }
    if (phoneNumber === "") {
      errors.phoneNumber = t("signup.emptyPhoneNumber");
    }
    if (email === "") {
      errors.email = t("signup.emptyEmail");
    }
    if (birthday === "") {
      errors.birthday = t("signup.emptyBirthday");
    }
    if (fullName === "") {
      errors.fullName = t("signup.emptyFullName");
    }
    if (address === "") {
      errors.homeAddress = t("signup.emptyAddress");
    }
    if (!captchaValue) errors.captcha = t("signup.captchaNotVerified");
    return errors;
  }, [
    password,
    confirmPassword,
    phoneNumber,
    email,
    birthday,
    fullName,
    address,
    t,
    captchaValue,
  ]);

  const handleRegister = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    try {
      const formattedBirthday = format(new Date(birthday), "yyyy-MM-dd");
      const requestData = {
        fullname: fullName,
        birthday: formattedBirthday,
        email: email,
        phoneNumber: phoneNumber,
        homeAddress: address,
        gender: gender.toUpperCase(),
        password: password,
        confirmPassword: confirmPassword,
      };
      console.log("Request Data:", requestData);
      const response = await Api({
        endpoint: "loan-service/borrower/register",
        method: METHOD_TYPE.POST,
        data: {
          fullname: fullName,
          birthday: formattedBirthday,
          email: email,
          phoneNumber: phoneNumber,
          homeAddress: address,
          gender: gender.toUpperCase(),
          password: password,
          confirmPassword: confirmPassword,
        }, 
      });
      const token = response;
      console.log(response.username);
      if (token) {
        Cookies.set("token", token);
        navigate("/");
      }
    } catch (error) {
      setErrorMessages({ login: t("signup.error") });
    }
  }, [
    password,
    confirmPassword,
    phoneNumber,
    email,
    birthday,
    fullName,
    address,
    gender,
    validateFields,
    navigate,
    t,
  ]);

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

  const handlePasswordBlur = () => {
    const errors = validateFields();
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      password: errors.password || "",
    }));
  };

  const handlePasswordFocus = () => {
    if (password === "") {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        password: t("signup.emptyPassword"),
      }));
    }
  };

  const handleOnkeydown = useCallback(
    (event, passwordFieldId) => {
      if (event.key === "Enter") {
        const passwordField = document.getElementById(passwordFieldId);
        if (passwordField) {
          passwordField.focus();
        } else {
          handleRegister();
        }
      }
    },
    [handleRegister]
  );

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleBackPage = () => {
    navigate("/login");
  };
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

  return (
    <>
      <div className="page-box">
        <LoginLayout showLogin={false} showBreadCrumbs={false}>
          <div className="loginFormBox">
            <div id="loginForm" className="loginForm">
            <div className="language-box">
              <LanguageSelector />
            </div>
              <h1 className="FormName">{t("signup.title")}</h1>
              <p className="description">{t("signup.subtitle")}</p>
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
              <div className="name-birth">
                <div className="field">
                  <label htmlFor="fullName">
                    {t("signup.fullName")}{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="text"
                    id="fullName"
                    value={fullName}
                    placeholder={t("signup.fullNamePlaceholder")}
                    errorMessage={errorMessages.fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`size-border + ${
                      errorMessages.fullName || errorMessages.login
                        ? "error-border"
                        : "correct-border"
                    }`}
                  />
                </div>
                <div className="field">
                  <label htmlFor="birthday">
                    {t("signup.birthday")}{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="date"
                    id="birthday"
                    value={birthday}
                    placeholder={t("signup.birthdayPlaceholder")}
                    errorMessage={errorMessages.birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className={`size-border+ ${
                      errorMessages.birthday || errorMessages.login
                        ? "error-border"
                        : "correct-border"
                    }`}
                  />
                </div>
              </div>
              <div className="email-phone">
                <div className="field">
                  <label htmlFor="email">
                    {t("signup.email")} <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="email"
                    id="email"
                    value={email}
                    placeholder={t("signup.emailPlaceholder")}
                    errorMessage={errorMessages.email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`size-border + ${
                      errorMessages.email || errorMessages.login
                        ? "error-border"
                        : "correct-border"
                    }`}
                  />
                </div>
                <div className="field">
                  <label htmlFor="phoneNumber">
                    {t("signup.phoneNumber")}{" "}
                    <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    placeholder={t("signup.phoneNumberPlaceholder")}
                    errorMessage={errorMessages.phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`size-border + ${
                      errorMessages.phoneNumber || errorMessages.login
                        ? "error-border"
                        : "correct-border"
                    }`}
                  />
                </div>
              </div>
              <div className="address-gender">
                <div className="field">
                  <label htmlFor="address">{t("signup.address")}</label>
                  <InputField
                    type="text"
                    id="address"
                    value={address}
                    placeholder={t("signup.addressPlaceholder")}
                    errorMessage={errorMessages.address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`size-border + ${
                      errorMessages.address || errorMessages.login
                        ? "error-border"
                        : "correct-border"
                    }`}
                    onKeyPress={(e) => handleOnkeydown(e, "password")}
                  />
                </div>
                <div className="field">
                  <label htmlFor="gender">{t("signup.gender")}</label>
                  <RadioGroup
                    options={[t("signup.male"), t("signup.female")]}
                    name="gender"
                    onChange={handleGenderChange}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="password">
                  {t("signup.password")} <span style={{ color: "red" }}> *</span>
                </label>
                <InputField
                  type="password"
                  id="password"
                  value={password}
                  placeholder={t("signup.passwordPlaceholder")}
                  errorMessage={errorMessages.password || errorMessages.login}
                  onBlur={handlePasswordBlur}
                  onFocus={handlePasswordFocus}
                  onChange={handlePasswordChange}
                  className={`size-border + ${
                    errorMessages.password || errorMessages.login
                      ? "error-border"
                      : "correct-border"
                  }`}
                  onKeyPress={(e) => handleOnkeydown(e, "captcha")}
                />
              </div>
              <InputField
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                placeholder={t("signup.confirmPasswordPlaceholder")}
                errorMessage={errorMessages.confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`size-border + ${
                  errorMessages.confirmPassword || errorMessages.login
                    ? "error-border"
                    : "correct-border"
                }`}
              />
              <div className="captcha-box">
                <label htmlFor="captcha" className="captcha-title">
                  Captcha <span style={{ color: "red" }}> *</span>
                </label>
                <ReCAPTCHA
                  sitekey="6Ldws3QqAAAAAMX5jNVnZPksWQRvMrp06k7uSbqz"
                  onChange={handleCaptchaChange}
                />
              </div>
              <div className="submit-cancel">
                <Button className="submit" onClick={handleRegister}>
                  {t("signup.button")}
                </Button>
                <Button className="cancel" onClick={handleBackPage}>
                  {t("common.cancel")}
                </Button>
              </div>
              <p className="register">
                {t("signup.alreadyHaveAccount")}&nbsp;
                <span className="register-link" onClick={handleLogin}>
                  {t("signup.login")}
                </span>
              </p>
            </div>
          </div>
        </LoginLayout>
      </div>
    </>
  );
}

const Register = React.memo(HandleRegisterPage);
export default Register;
