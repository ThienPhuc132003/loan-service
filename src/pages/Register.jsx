// src/pages/Register.jsx
import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/css/Register.style.css";
import LoginLayout from "../components/layout/LoginLayout"; // [`LoginLayout`](src/components/layout/LoginLayout.jsx)
import Button from "../components/Button"; // [`Button`](src/components/Button.jsx)
import InputField from "../components/InputField"; // [`InputField`](src/components/InputField.jsx)
import Api from "../network/Api"; // [`Api`](src/network/Api.js)
import { METHOD_TYPE } from "../network/methodType"; // [`METHOD_TYPE`](src/network/methodType.js)
import logoFb from "../assets/images/logoFb.png";
import logoGoogle from "../assets/images/logoGoogle.png";
import RadioGroup from "../components/Radio"; // [`RadioGroup`](src/components/Radio.jsx)
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import { format } from "date-fns";
import LanguageSelector from "../components/LanguageSelector"; // [`LanguageSelector`](src/components/LanguageSelector.jsx)

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
    if (fullName === "") {
      errors.fullName = t("signup.emptyFullName");
    } else if (fullName.length > 30) {
      errors.fullName = t("signup.fullNameTooLong");
    } else if (/[^a-zA-Z\s]/.test(fullName)) {
      errors.fullName = t("signup.invalidFullName");
    } else if (/^\s|\s$/.test(fullName)) {
      errors.fullName = t("signup.fullNameWhitespace");
    }

    if (birthday === "") {
      errors.birthday = t("signup.emptyBirthday");
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
      errors.birthday = t("signup.invalidBirthdayFormat");
    }

    if (email === "") {
      errors.email = t("signup.emptyEmail");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("signup.invalidEmailFormat");
    }

    if (phoneNumber === "") {
      errors.phoneNumber = t("signup.emptyPhoneNumber");
    } else if (!/^\d{10,11}$/.test(phoneNumber)) {
      errors.phoneNumber = t("signup.invalidPhoneNumber");
    }

    if (address === "") {
      errors.homeAddress = t("signup.emptyAddress");
    }

    if (gender === "") {
      errors.gender = t("signup.emptyGender");
    } else if (!["MALE", "FEMALE"].includes(gender.toUpperCase())) {
      errors.gender = t("signup.invalidGender");
    }

    if (password === "") {
      errors.password = t("signup.emptyPassword");
    } else if (password.length < 6) {
      errors.password = t("signup.passwordTooShort");
    } else if (password.length > 12) {
      errors.password = t("signup.passwordTooLong");
    } else if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !/[!@#$%^&*]/.test(password)
    ) {
      errors.password = t("signup.weakPassword");
    }

    if (confirmPassword === "") {
      errors.confirmPassword = t("signup.emptyConfirmPassword");
    } else if (confirmPassword !== password) {
      errors.confirmPassword = t("signup.passwordMismatch");
    }

    if (!captchaValue) {
      errors.captcha = t("common.captchaNotVerified");
    }

    return errors;
  }, [
    fullName,
    birthday,
    email,
    phoneNumber,
    address,
    gender,
    password,
    confirmPassword,
    captchaValue,
    t,
  ]);

  const handleRegister = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      // Clear input fields
      setFullName("");
      setBirthday("");
      setEmail("");
      setPhoneNumber("");
      setAddress("");
      setGender("");
      setPassword("");
      setConfirmPassword("");
      setCaptchaValue(null);
      return;
    }
    try {
      const formattedBirthday = format(new Date(birthday), "yyyy-MM-dd");
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

      if (response.success) {
        Cookies.set("token", response.token);
        navigate("/");
      } else {
        const serverErrors = response.data || {};
        const newErrorMessages = {};
        for (const [field, errorType] of Object.entries(serverErrors)) {
          if (errorType === "INVALID") {
            newErrorMessages[field] = t("common.invalidValue");
          }
          // Add more error handling as needed
        }
        setErrorMessages(newErrorMessages);
      }
    } catch (error) {
      setErrorMessages({ login: t("common.requestFailed") });
    }
  }, [
    fullName,
    birthday,
    email,
    phoneNumber,
    address,
    gender,
    password,
    confirmPassword,
    validateFields,
    navigate,
    t,
  ]);

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
                  <img src={logoGoogle} alt="Google" className="login-img" />
                  Google
                </div>
                <div className="login-option">
                  <img src={logoFb} alt="Facebook" className="login-img" />
                  Facebook
                </div>
              </div>
              <div className="divider">
                <span>{t("common.or")}</span>
              </div>
              <div className="name-birth">
                <div className="field">
                  <label htmlFor="fullName">
                    {t("signup.fullName")} <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="text"
                    id="fullName"
                    value={fullName}
                    placeholder={t("signup.fullNamePlaceholder")}
                    errorMessage={errorMessages.fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`size-border ${
                      errorMessages.fullName ? "error-border" : "correct-border"
                    }`}
                  />
                </div>
                <div className="field">
                  <label htmlFor="birthday">
                    {t("signup.birthday")} <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="date"
                    id="birthday"
                    value={birthday}
                    placeholder={t("signup.birthdayPlaceholder")}
                    errorMessage={errorMessages.birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className={`size-border ${
                      errorMessages.birthday ? "error-border" : "correct-border"
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
                    className={`size-border ${
                      errorMessages.email ? "error-border" : "correct-border"
                    }`}
                  />
                </div>
                <div className="field">
                  <label htmlFor="phoneNumber">
                    {t("signup.phoneNumber")} <span style={{ color: "red" }}> *</span>
                  </label>
                  <InputField
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    placeholder={t("signup.phoneNumberPlaceholder")}
                    errorMessage={errorMessages.phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className={`size-border ${
                      errorMessages.phoneNumber ? "error-border" : "correct-border"
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
                    errorMessage={errorMessages.homeAddress}
                    onChange={(e) => setAddress(e.target.value)}
                    className={`size-border ${
                      errorMessages.homeAddress ? "error-border" : "correct-border"
                    }`}
                  />
                </div>
                <div className="field">
                  <label htmlFor="gender">{t("signup.gender")}</label>
                  <RadioGroup
                    options={[t("signup.male"), t("signup.female")]}
                    name="gender"
                    onChange={(value) => setGender(value)}
                    errorMessage={errorMessages.gender}
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
                  errorMessage={errorMessages.password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`size-border ${
                    errorMessages.password ? "error-border" : "correct-border"
                  }`}
                />
              </div>
              <div className="field">
                <label htmlFor="confirmPassword">
                  {t("signup.confirmPassword")} <span style={{ color: "red" }}> *</span>
                </label>
                <InputField
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  placeholder={t("signup.confirmPasswordPlaceholder")}
                  errorMessage={errorMessages.confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`size-border ${
                    errorMessages.confirmPassword ? "error-border" : "correct-border"
                  }`}
                />
              </div>
              <div className="captcha-box">
                <label htmlFor="captcha" className="captcha-title">
                  {t("signup.captcha")} <span style={{ color: "red" }}> *</span>
                </label>
                <ReCAPTCHA
                  sitekey="your-site-key"
                  onChange={handleCaptchaChange}
                />
                <p className="error">{errorMessages.captcha}</p>
              </div>
              <div className="submit-cancel">
                <Button className="submit" onClick={handleRegister}>
                  {t("signup.button")}
                </Button>
                <Button className="cancel" onClick={() => navigate("/login")}>
                  {t("common.cancel")}
                </Button>
              </div>
              <p className="register">
                {t("signup.alreadyHaveAccount")}{" "}
                <span
                  className="register-link"
                  onClick={() => navigate("/login")}
                >
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