// src/pages/LoginPage.js
import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "../assets/css/login.style.css";
import LoginLayout from "../components/layout/LoginLayout";
import Button from "../components/Button";
import InputField from "../components/InputField";
import Api from "../network/Api";
import { METHOD_TYPE } from "../network/methodType";
import logoFb from "../assets/images/logoFb.png";
import logoGoogle from "../assets/images/logoGoogle.png";

function HandleLoginPage() {
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
      console.log(response.data.token);
      if (token) {
        Cookies.set("token", token);
        navigate("/main-page");
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
        username: "Tài khoản không được để trống",
      }));
    }
  };

  const handlePasswordFocus = () => {
    if (password === "") {
      setErrorMessages((prevErrors) => ({
        ...prevErrors,
        password: "Mật khẩu không được để trống",
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
          handleLogin();
        }
      }
    },
    [handleLogin]
  );
  const handleRegister = () => {
    navigate("/register");
  };
  return (
    <>
      <LoginLayout showLogin={false} showBreadCrumbs={false}>
        <div className="loginFormBox">
          <div id="loginForm" className="loginForm">
            <h1 className="FormName">Đăng nhập</h1>
            <p className="description">Nhập thông tin để đăng nhập</p>
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
            <label htmlFor="username">Email hoặc số điện thoại</label>
            <InputField
              type="text"
              id="username"
              name="Username"
              value={username}
              errorMessage={errorMessages.username || errorMessages.login}
              onBlur={handleUsernameBlur}
              onFocus={handleUsernameFocus}
              onChange={handleUsernameChange}
              className={
                errorMessages.username || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }
              onKeyPress={(e) => handleOnkeydown(e, "password")}
            />
            <label htmlFor="password">Mật khẩu</label>
            <InputField
              type="password"
              id="password"
              name="Password"
              value={password}
              errorMessage={errorMessages.password || errorMessages.login}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              onChange={handlePasswordChange}
              className={
                errorMessages.password || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }
              onKeyPress={(e) => handleOnkeydown(e, "captcha")}
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
              <Button className="submit" onClick={handleLogin}>
                Đăng nhập
              </Button>
              <Button className="cancel">Hủy</Button>
            </div>
            <span className="forgot-password">Quên mật khẩu ?</span>
            <p className="register">
              Chưa có tài khoản ?&nbsp;
              <span className="register-link" onClick={handleRegister}>
                Đăng ký
              </span>
            </p>
          </div>
        </div>
      </LoginLayout>
    </>
  );
}

const LoginPage = React.memo(HandleLoginPage);
export default LoginPage;
