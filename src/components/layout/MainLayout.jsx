import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../../assets/css/MainLayout.style.css";
import UserAccountToolbar from "./UserAccountToolbar";
import RealTime from "../RealTime";
import { fetchMenuData } from "../../redux/menuSlice";
import { useTranslation } from "react-i18next";
import { setSidebarVisibility, toggleSidebar } from "../../redux/uiSlice";
import Cookies from "js-cookie";

const MainLayoutComponent = (props) => {
  const {
    children = null,
    childrenMiddleContentLower = null,
    rightChildren = null,
    currentPath,
    currentPage,
  } = props;

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const menuData = useSelector((state) => state.menu.data);
  const menuStatus = useSelector((state) => state.menu.status);
  const isSidebarVisible = useSelector((state) => state.ui.isSidebarVisible);
  const location = useLocation();
  const role = Cookies.get("role");

  const [openMenus, setOpenMenus] = useState({});

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

  const handleMenuClick = (menuName) => {
    setOpenMenus((prevOpenMenus) => {
      const newOpenMenus = { ...prevOpenMenus };
      if (newOpenMenus[menuName]) {
        delete newOpenMenus[menuName];
      } else {
        newOpenMenus[menuName] = true;
      }
      localStorage.setItem("openMenus", JSON.stringify(newOpenMenus));
      return newOpenMenus;
    });
  };

  useEffect(() => {
    const savedOpenMenus = JSON.parse(localStorage.getItem("openMenus"));
    if (savedOpenMenus) {
      setOpenMenus(savedOpenMenus);
    } else {
      const initialOpenMenus = {};
      menuData.forEach((menu) => {
        initialOpenMenus[menu.name_en] = false;
      });
      setOpenMenus(initialOpenMenus);
    }
  }, [menuData]);

  const renderMenuItems = (items) => {
    return items.map((item) => {
      const itemName = i18n.language === "en" ? item.name_en : item.name_vn;
      const itemPath = item.name_en.toLowerCase().replace(/ /g, "-");
      const isActive = location.pathname.includes(itemPath);

      const hasActiveChild =
        item.children &&
        item.children.some((child) =>
          location.pathname.includes(
            child.name_en.toLowerCase().replace(/ /g, "-")
          )
        );

      if (item.children && item.isCollapsed) {
        return (
          <React.Fragment key={item.name_en}>
            <li
              key={item.name_en}
              className={`menu-item ${
                isActive || hasActiveChild ? "active" : ""
              }`}
              onClick={() => handleMenuClick(item.name_en)}
            >
              <a className="menu-item">
                <img src={item.icon} alt={itemName} className="menu-icon" />
                <p className="menu-name">{itemName}</p>
              </a>
            </li>
            {openMenus[item.name_en] && (
              <ul className="submenu">{renderMenuItems(item.children)}</ul>
            )}
          </React.Fragment>
        );
      }

      return (
        <li
          key={item.name_en}
          className={`menu-item ${isActive ? "active" : ""}`}
        >
          <Link to={`/${itemPath}`}>
            <img src={item.icon} alt={itemName} className="menu-icon" />
            <p className="menu-name">{itemName}</p>
          </Link>
        </li>
      );
    });
  };

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
          </ul>
        </nav>
        <hr className="main-layout-divider" />
        <nav className="secondary-navigation">
          <ul>{role === "employee" && renderMenuItems(menuData)}</ul>
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
          <UserAccountToolbar currentPath={currentPath} />
        </div>
        <div className="main-layout-content">
          <div className="main-layout-left">
            {children}
            {childrenMiddleContentLower}
          </div>
          {rightChildren && (
            <div className="main-layout-right">{rightChildren}</div>
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
  currentPage: PropTypes.string.isRequired,
};

const MainLayout = React.memo(MainLayoutComponent);
export default MainLayout;
