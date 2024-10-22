import React, { useCallback } from "react";
import logo from "../assets/images/logoF1.png";
import Proptypes from "prop-types";
import "../assets/css/Navbar.style.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const NavbarComponent = (props) => {
  const { showLogin = false } = props;

  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    navigate("/login");
  }, [navigate]);

  const handleFurniturePage = useCallback(
    () => navigate("/main-page"),
    [navigate]
  );
  return (
    <>
      <div className="nav-box" />
      <div className="navigation">
        <ul className="btn-box">
          <div className="brand">
            <img src={logo} alt="logo" className="logo" />
            <p className="label">
              Loan<br/>
              system
            </p>
          </div>
          {showLogin && (
            <li>
              <button className="nav-btn active" onClick={handleFurniturePage}>
                Furniture
              </button>
            </li>
          )}
        </ul>
        {showLogin && (
          <ul className="btn-box">
            <li id="logout-btn">
              <button className="nav-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        )}
      </div>
      {/* {showBreadCrumbs && <Breadcrumbs />} */}
    </>
  );
};

const Navbar = React.memo(NavbarComponent);
export default Navbar;

NavbarComponent.propTypes = {
  showLogin: Proptypes.bool,
  showBreadCrumbs: Proptypes.bool,
};
