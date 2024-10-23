// src/pages/LoginPage.js
import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../assets/css/Register.style.css";
import Baselayout from "../components/layout/Baselayout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
// import axiosClient from "../network/axiosClient";

function HandleRegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();
  const validateFields = useCallback(() => {
    const errors = {};

    if (username === "") {
      errors.username = "Username cannot be empty";
    }
    if (password === "") {
      errors.password = "Password cannot be empty";
    }

    return errors;
  }, [username, password]);
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
          username: username,
          password: password,
        },
      });
      const { token } = response;
      console.log(response.username);
      if (token) {
        Cookies.set("token", token);
        navigate("/");
      }
    } catch (error) {
      setErrorMessages({ login: "Invalid username or password" });
    }
  }, [navigate, username, password, validateFields]);

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

  const handleUsernameBlur = () => {
    const errors = validateFields();
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      username: errors.username || "",
    }));
  };

  const handlePasswordBlur = () => {
    const errors = validateFields();
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      password: errors.password || "",
    }));
  };

  const handleUsernameFocus = () => {
    if (username === "") {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        username: "Username cannot be empty",
      }));
    }
  };

  const handlePasswordFocus = () => {
    if (password === "") {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        password: "Password cannot be empty",
      }));
    }
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <>
      <Baselayout showLogin={false} showBreadCrumbs={false}>
        <div className="loginFormBox">
          <div id="loginForm" className="loginForm">
            <h1>Register form</h1>
            <p className="description">Điền thông tin để đăng ký tài khoản</p>
            <div className="other-login">
              <div className="login-option">
                {/* <img src={userLogo} alt="User" className="login-img" /> */}
                Google
              </div>
              <div className="login-option">
                {/* <img src={userLogo} alt="User" className="login-img" /> */}
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
                  //   value={fullName}
                  errormessages={errorMessages}
                  className={`size-border2 + ${
                    errorMessages.password || errorMessages.login
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
                  //   value={birthday}
                  errormessages={errorMessages}
                  className={`size-border2 + ${
                    errorMessages.password || errorMessages.login
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
                  //   value={email}
                  errormessages={errorMessages}
                  className={`size-border2 + ${
                    errorMessages.password || errorMessages.login
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
                  //   value={phoneNumber}
                  errormessages={errorMessages}
                  className={`size-border2 + ${
                    errorMessages.password || errorMessages.login
                      ? "error-border"
                      : "correct-border"
                  }`}
                />
              </div>
            </div>
            <label htmlFor="username">Tài khoản</label>
            <InputField
              type="text"
              id="username"
              name="username"
              placeholder="Nhập tài khoản"
              value={username}
              erromessages={errorMessages}
              onBlur={handleUsernameBlur}
              onFocus={handleUsernameFocus}
              onChange={handleUsernameChange}
              className={`size-border + ${
                errorMessages.password || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }`}
            />
            <p className="error">{errorMessages.username}</p>
            <label htmlFor="password">Mật khẩu</label>
            <InputField
              type="password"
              id="password"
              name="password"
              placeholder="Nhập mật khẩu ( ít nhất 6 chữ số, tối thiểu 1 chữ số viết hoa, 1 ký tự đặc biệt, 1 số"
              value={password}
              errormessages={errorMessages}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              onChange={handlePasswordChange}
              className={`size-border + ${
                errorMessages.password || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }`}
            />
            <InputField
              type="retypePassword"
              id="retypePassword"
              name="retypePassword"
              placeholder="Nhập lại mật khẩu"
              value={password}
              errormessages={errorMessages}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              onChange={handlePasswordChange}
              className={`size-border + ${
                errorMessages.password || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }`}
            />
            <p className="error">{errorMessages.password}</p>
            <p className="error">{errorMessages.login}</p>
            <div className="capcha-box">
              <InputField
                type="capcha"
                id="capcha"
                name="capcha"
                placeholder="Capcha"
                errormessages={errorMessages}
                className={"capcha-input"}
              ></InputField>
              <Button className="capcha-regenerate">Capcha here</Button>
            </div>
            <Button className="submit" onClick={handleRegister}>
              Đăng ký
            </Button>
            <p className="register">
              Đã có tài khoản ?&nbsp;
              <span className="register-link" onClick={handleLogin}>
                Đăng nhập
              </span>
            </p>
          </div>
        </div>
      </Baselayout>
    </>
  );
}

const Register = React.memo(HandleRegisterPage);
export default Register;
