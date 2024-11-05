import React from "react";
import PropTypes from "prop-types";
import "../../assets/css/MainLayout.style.css";

const MainLayoutComponent = (props) => {
  const { children = null, currentPath } = props;

  return (
    <div className="main-layout">
      <div className="sidebar">
        <nav>
          <ul>
            <li className={currentPath === "/main-page" ? "active" : ""}>
              <a href="/main-page">DashBoard</a>
            </li>
            <li className={currentPath === "/about" ? "active" : ""}>
              <a href="/about">About</a>
            </li>
            <li className={currentPath === "/services" ? "active" : ""}>
              <a href="/services">Services</a>
            </li>
            <li className={currentPath === "/contact" ? "active" : ""}>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="content">{children}</div>
    </div>
  );
};

MainLayoutComponent.propTypes = {
  children: PropTypes.node,
  currentPath: PropTypes.string.isRequired,
};

const MainLayout = React.memo(MainLayoutComponent);
export default MainLayout;