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
// import axiosClient from "../network/axiosClient";

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
            <h1>Login form</h1>
            <p className="description">Điền thông tin để đăng nhập</p>
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
            <label htmlFor="username">Username</label>
            <InputField
              type="text"
              id="username"
              name="username"
              placeholder="Username"
              value={username}
              erromessages={errorMessages}
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
            <p className="error">{errorMessages.username}</p>
            <label htmlFor="password">Password</label>
            <InputField
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              errormessages={errorMessages}
              onBlur={handlePasswordBlur}
              onFocus={handlePasswordFocus}
              onChange={handlePasswordChange}
              className={
                errorMessages.password || errorMessages.login
                  ? "error-border"
                  : "correct-border"
              }
              onKeyPress={(e) => handleOnkeydown(e)}
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
            <Button className="submit" onClick={handleLogin}>
              Đăng nhập
            </Button>
            <p className="forgot-password">Quên mật khẩu ?</p>
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
