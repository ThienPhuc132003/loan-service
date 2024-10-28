// src/pages/LoginPage.js
import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../assets/css/Register.style.css";
import LoginLayout from "../components/layout/LoginLayout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import logoFb from "../assets/images/logoFb.png";
import logoGoogle from "../assets/images/logoGoogle.png";
import RadioGroup from "../components/Radio";
// import axiosClient from "../network/axiosClient";

function HandleRegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState(""); // State for gender
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const validateFields = useCallback(() => {
    const errors = {};

    if (password === "") {
      errors.password = "Password cannot be empty";
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (phoneNumber === "") {
      errors.phoneNumber = "Phone number cannot be empty";
    }
    if (email === "") {
      errors.email = "Email cannot be empty";
    }
    if (birthday === "") {
      errors.birthday = "Birthday cannot be empty";
    }
    if (fullName === "") {
      errors.fullName = "Full name cannot be empty";
    }
    if (address === "") {
      errors.homeAddress = "Home address cannot be empty";
    }
    return errors;
  }, [
    password,
    confirmPassword,
    phoneNumber,
    email,
    birthday,
    fullName,
    address,
  ]);
  const handleRegister = useCallback(async () => {
    const errors = validateFields();
    setErrorMessages(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await Api({
        endpoint: "https://667943a618a459f6394ee5b4.mockapi.io/login",
        method: METHOD_TYPE.POST,
        data: {
          fullname: fullName,
          birthday: birthday,
          email: email,
          phoneNumber: phoneNumber,
          homeAddress: address,
          gender: gender,
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
      setErrorMessages({ login: "Invalid username or password" });
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
        password: "Password cannot be empty",
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
  return (
    <>
      <LoginLayout showLogin={false} showBreadCrumbs={false}>
        <div className="loginFormBox">
          <div id="loginForm" className="loginForm">
            <h1 className="FormName"> Đăng ký</h1>
            <p className="description">Điền thông tin để đăng ký tài khoản</p>
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
              <span>or</span>
            </div>
            <div className="name-birth">
              <div className="field">
                <label htmlFor="fullName">Họ tên</label>
                <InputField
                  type="text"
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ tên"
                  value={fullName}
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
                <label htmlFor="birthday">Ngày sinh</label>
                <InputField
                  type="date"
                  id="birthday"
                  name="birthday"
                  placeholder="Nhập ngày sinh"
                  value={birthday}
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
                <label htmlFor="email">Email</label>
                <InputField
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Nhập email"
                  value={email}
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
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <InputField
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
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
                <label htmlFor="adress">Địa chỉ</label>
                <InputField
                  type="text"
                  id="adress"
                  name="adress"
                  value={address}
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
                <label htmlFor="adress">Địa chỉ</label>
                <RadioGroup
                  options={["Nam", "Nữ"]}
                  name="gender"
                  onChange={handleGenderChange}
                />
              </div>
            </div>
            <label htmlFor="password">Mật khẩu</label>
            <InputField
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu ( ít nhất 6 chữ số, tối thiểu 1 chữ số viết hoa, 1 ký tự đặc biệt, 1 số"
              value={password}
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
            <InputField
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              errorMessage={errorMessages.confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`size-border + ${
                errorMessages.confirmPassword || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }`}
            />
            <p className="error">{errorMessages.login}</p>
            <div className="captcha-box">
              <label htmlFor="captcha" className="captcha-title">
                Captcha
              </label>
              <InputField
                type="captcha"
                id="captcha"
                name="captcha"
                placeholder="captcha"
                errormessages={errorMessages}
                className={"captcha-input"}
              ></InputField>
              <Button className="captcha-regenerate">captcha here</Button>
            </div>
            <div className="submit-cancel">
              <Button className="submit" onClick={handleRegister}>
                Đăng ký
              </Button>
              <Button className="cancel">Hủy</Button>
            </div>
            <p className="register">
              Đã có tài khoản ?&nbsp;
              <span className="register-link" onClick={handleLogin}>
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      </LoginLayout>
    </>
  );
}

const Register = React.memo(HandleRegisterPage);
export default Register;
