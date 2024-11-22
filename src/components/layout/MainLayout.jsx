import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "../../assets/css/MainLayout.style.css";
import UserAccountToolbar from "./UserAccountToolbar";
import RealTime from "../RealTime";
import { useState } from "react";
import { METHOD_TYPE } from "../../network/methodType";
import Api from "../../network/Api";
import { fullMenuData } from "../../assets/data/FullMenuData";
const MainLayoutComponent = (props) => {
  const {
    children = null,
    rightChildren = null,
    currentPath,
    onLogout,
    currentPage,
  } = props;
  const [menuData, setMenuData] = useState([]);


  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await Api({
          endpoint: "http://152.42.232.101:7000/menu/me",
          method: METHOD_TYPE.GET,
        });
        console.log(response);
        setMenuData(response.data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchMenuData();
  }, []);

  const menuItems = fullMenuData.filter((item) => menuData.includes(item.key));
  return (
    <div className="main-layout">
      <div className="sidebar">
        <h1 className="main-logo">Alpha</h1>
        <nav className="primary-navigation">
          <ul>
            <li className={currentPath === "/main-page" ? "active" : ""}>
              <a href="/main-page">
                <i className="fa-solid fa-house"></i> DashBoard
              </a>
            </li>
            <li className={currentPath === "/about" ? "active" : ""}>
              <a href="/about">
                <i className="fa-solid fa-chart-simple"></i> Thống kê
              </a>
            </li>
            <li className={currentPath === "/services" ? "active" : ""}>
              <a href="/services">
                <i className="fa-regular fa-calendar"></i> lịch
              </a>
            </li>
            <li className={currentPath === "/contact" ? "active" : ""}>
              <a href="/contact">
                <i className="fa-regular fa-message"></i> tin nhắn
              </a>
            </li>
          </ul>
        </nav>
        <hr className="divider" />
        <nav className="secondary-navigation">
          <ul>
            {" "}
            {menuItems.map((item) => (
              <li key={item.key} className="menu-item">
                <a href={`/${item.key.toLowerCase()}`}>
                  <i className={`fa ${item.icon}`}></i> {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <RealTime></RealTime>
      </div>
      <div className="content-area">
        <div className="header">
          <h1 className="current-page">{currentPage}</h1>
          <UserAccountToolbar
            currentPath={currentPath}
            onLogout={onLogout}
          />
        </div>
        <div className="main-content">
          <div className="middle-content">{children}</div>
          <div className="right-content">{rightChildren}</div>
        </div>
      </div>
    </div>
  );
};

MainLayoutComponent.propTypes = {
  children: PropTypes.node,
  rightChildren: PropTypes.node,
  currentPath: PropTypes.string.isRequired,
  onLogout: PropTypes.func,
  currentPage: PropTypes.string,
};

const MainLayout = React.memo(MainLayoutComponent);
export default MainLayout;
