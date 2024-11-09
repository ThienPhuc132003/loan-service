import React from "react";
import PropTypes from "prop-types";
import "../../assets/css/MainLayout.style.css";
import UserAccountToolbar from "./UserAccountToolbar";

const MainLayoutComponent = (props) => {
  const {
    children = null,
    rightChildren = null,
    currentPath,
    onEditProfile,
    onLogout,
    currentPage,
  } = props;

  return (
    <div className="main-layout">
      <div className="sidebar">
        <nav>
          <ul>
            <li className={currentPath === "/main-page" ? "active" : ""}>
              <a href="/main-page">
                <i className="fa-solid fa-house"></i> DashBoard
              </a>
            </li>
            <li className={currentPath === "/about" ? "active" : ""}>
              <a href="/about">
                <i className="fa-solid fa-chart-simple"></i> About
              </a>
            </li>
            <li className={currentPath === "/services" ? "active" : ""}>
              <a href="/services">
                <i className="fa-regular fa-calendar"></i> Services
              </a>
            </li>
            <li className={currentPath === "/contact" ? "active" : ""}>
              <a href="/contact">
                <i className="fa-regular fa-message"></i> Contact
              </a>
            </li>
          </ul>
        </nav>
        <hr className="divider" />
        <nav>
          <ul>{/* Add more menu items here */}</ul>
        </nav>
      </div>
      <div className="content-area">
        <div className="header">
          <h1 className="current-page">{currentPage}</h1>
          <UserAccountToolbar
            currentPath={currentPath}
            onEditProfile={onEditProfile}
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
  onEditProfile: PropTypes.func,
  onLogout: PropTypes.func,
  currentPage: PropTypes.string,
};

const MainLayout = React.memo(MainLayoutComponent);
export default MainLayout;
