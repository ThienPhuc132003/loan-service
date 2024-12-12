import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/MainLayout.style.css";
import UserAccountToolbar from "./UserAccountToolbar";
import RealTime from "../RealTime";
import { fetchMenuData } from "../../redux/menuSlice";
import { fullMenuData } from "../../assets/data/FullMenuData";
import { useTranslation } from "react-i18next";
import { setSidebarVisibility, toggleSidebar } from "../../redux/uiSlice";
import Cookies from "js-cookie";

const MainLayoutComponent = (props) => {
  const {
    children = null,
    childrenMiddleContentLower = null,
    rightChildren = null,
    currentPath,
    onLogout,
    currentPage,
  } = props;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.data);
  const menuStatus = useSelector((state) => state.menu.status);
  const isSidebarVisible = useSelector((state) => state.ui.isSidebarVisible);
  const location = useLocation();
  const role = Cookies.get("role");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        dispatch(setSidebarVisibility(false));
      } else {
        dispatch(setSidebarVisibility(true));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      dispatch(setSidebarVisibility(false));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    if (menuStatus === "idle") {
      dispatch(fetchMenuData());
    }
  }, [menuStatus, dispatch]);

  const menuItems = fullMenuData.filter((item) => menuData.includes(item.key));

  return (
    <div className={`main-layout ${isSidebarVisible ? "" : "sidebar-hidden"}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <h1 className="main-logo">Alpha</h1>
        <nav className="primary-navigation">
          <ul>
            <li className={currentPath === "/main-page" ? "active" : ""}>
              <Link to="/main-page">
                <i className="fa-solid fa-house"></i>{" "}
                <p className="menu-name">{t("menu.dashboard")}</p>
              </Link>
            </li>
            <li className={currentPath === "/about" ? "active" : ""}>
              <Link to="/about">
                <i className="fa-solid fa-chart-simple"></i>{" "}
                <p className="menu-name">{t("menu.statistics")}</p>
              </Link>
            </li>
            <li className={currentPath === "/services" ? "active" : ""}>
              <Link to="/services">
                <i className="fa-regular fa-calendar"></i>{" "}
                <p className="menu-name">{t("menu.schedule")}</p>
              </Link>
            </li>
            <li className={currentPath === "/contact" ? "active" : ""}>
              <Link to="/contact">
                <i className="fa-regular fa-message"></i>{" "}
                <p className="menu-name">{t("menu.messages")}</p>
              </Link>
            </li>
            {/* {role === "borrower" && (
              <>
                <li
                  className={
                    currentPath === "/list-of-asset-types" ? "active" : ""
                  }
                >
                  <Link to="/list-of-asset-types">
                    <i className="fa-solid fa-coins"></i>{" "}
                    <p className="menu-name">
                      {t("menu.assetTypes") + "(test)"}
                    </p>
                  </Link>
                </li>
                <li
                  className={currentPath === "/list-of-assets" ? "active" : ""}
                >
                  <Link to="/list-of-assets">
                    <i className="fa-solid fa-coins"></i>{" "}
                    <p className="menu-name">{t("menu.assets") + "(test)"}</p>
                  </Link>
                </li>
                <li
                  className={
                    currentPath === "/list-of-employees" ? "active" : ""
                  }
                >
                  <Link to="/list-of-employees">
                    <i className="fa-solid fa-users"></i>{" "}
                    <p className="menu-name">
                      {t("menu.employees") + "(test)"}
                    </p>
                  </Link>
                </li>
                <li
                  className={
                    currentPath === "/list-of-customers" ? "active" : ""
                  }
                >
                  <Link to="/list-of-customers">
                    <i className="fa-solid fa-users"></i>{" "}
                    <p className="menu-name">
                      {t("menu.customers") + "(test)"}
                    </p>
                  </Link>
                </li>
              </>
            )} */}
          </ul>
        </nav>
        <hr className="main-layout-divider" />
        <nav className="secondary-navigation">
          <ul>
            {role === "employee" && (
              <>
                {menuItems.map((item) => (
                  <li key={item.key} className="menu-item">
                    <Link to={`/${item.key.toLowerCase().replace(/_/g, '-')}`}>
                      <i className={`fa ${item.icon}`}></i>{" "}
                      <p className="menu-name">
                        {" "}
                        {t(`menu.${item.key.toLowerCase()}`)}
                      </p>
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </nav>
        <RealTime />
      </div>

      {/* Content Area */}
      <div className="content-area">
        <button
          className="toggle-sidebar-btn"
          onClick={() => dispatch(toggleSidebar())}
        >
          {isSidebarVisible ? "⟨" : "⟩"}
        </button>
        <div className="main-layout-header">
          <h1 className="current-page">{currentPage}</h1>
          <UserAccountToolbar currentPath={currentPath} onLogout={onLogout} />
        </div>
        <div className="main-content">
          <div className="middle-content">
            <div className="middle-content-upper">{children}</div>
            <div className="middle-content-lower">
              {childrenMiddleContentLower}
            </div>
          </div>
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
  childrenMiddleContentLower: PropTypes.node,
  rightChildren: PropTypes.node,
  currentPath: PropTypes.string.isRequired,
  onLogout: PropTypes.func,
  currentPage: PropTypes.string,
};

const MainLayout = React.memo(MainLayoutComponent);
export default MainLayout;
