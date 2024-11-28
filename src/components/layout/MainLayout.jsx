import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/MainLayout.style.css";
import UserAccountToolbar from "./UserAccountToolbar";
import RealTime from "../RealTime";
import { fetchMenuData } from "../../redux/menuSlice";
import { fullMenuData } from "../../assets/data/FullMenuData";
import { useTranslation } from "react-i18next";

const MainLayoutComponent = (props) => {
  const {
    children = null,
    rightChildren = null,
    currentPath,
    onLogout,
    currentPage,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.data);
  const menuStatus = useSelector((state) => state.menu.status);

  useEffect(() => {
    if (menuStatus === "idle") {
      dispatch(fetchMenuData());
    }
  }, [menuStatus, dispatch]);

  const menuItems = fullMenuData.filter((item) => menuData.includes(item.key));

  return (
    <div className="main-layout">
      <div className="sidebar">
        <h1 className="main-logo">Alpha</h1>
        <nav className="primary-navigation">
          <ul>
            <li className={currentPath === "/main-page" ? "active" : ""}>
              <Link to="/main-page">
                <i className="fa-solid fa-house"></i> {t("menu.dashboard")}
              </Link>
            </li>
            <li className={currentPath === "/about" ? "active" : ""}>
              <Link to="/about">
                <i className="fa-solid fa-chart-simple"></i> {t("menu.statistics")}
              </Link>
            </li>
            <li className={currentPath === "/services" ? "active" : ""}>
              <Link to="/services">
                <i className="fa-regular fa-calendar"></i> {t("menu.schedule")}
              </Link>
            </li>
            <li className={currentPath === "/contact" ? "active" : ""}>
              <Link to="/contact">
                <i className="fa-regular fa-message"></i> {t("menu.messages")}
              </Link>
            </li>
          </ul>
        </nav>
        <hr className="main-layout-divider" />
        <nav className="secondary-navigation">
          <ul>
            {menuItems.map((item) => (
              <li key={item.key} className="menu-item">
                <Link to={`/${item.key.toLowerCase()}`}>
                  <i className={`fa ${item.icon}`}></i> {t(`menu.${item.key.toLowerCase()}`)}
                </Link>
              </li>
            ))}
            <li className={currentPath === "/list-of-asset-types" ? "active" : ""}>
              <Link to="/list-of-asset-types">
                <i className="fa-solid fa-coins"></i> {t("menu.assetTypes")}
              </Link>
            </li>
            <li className={currentPath === "/list-of-assets" ? "active" : ""}>
              <Link to="/list-of-assets">
                <i className="fa-solid fa-coins"></i> {t("menu.assets")}
              </Link>
            </li>
          </ul>
        </nav>
        <RealTime />
      </div>
      <div className="content-area">
        <div className="main-layout-header">
          <h1 className="current-page">{currentPage}</h1>
          <UserAccountToolbar currentPath={currentPath} onLogout={onLogout} />
        </div>
        <div className="main-content">
          <div className="middle-content">{children}</div>
          {rightChildren && (
            <div className="right-content">{rightChildren}</div>
          )}
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