import React from "react";
import Navbar from "../Navbar";
import PropTypes from "prop-types";

const BaseLayoutComponent = (props) => {
  const { showLogin = false, children = null, } = props;
  return (
    <>
      <Navbar showLogin={showLogin}/>
      {children}
    </>
  );
};
const BaseLayout = React.memo(BaseLayoutComponent);
export default BaseLayout;
BaseLayoutComponent.propTypes = {
  showLogin: PropTypes.bool,
  showBreadCrumbs: PropTypes.bool,
  handleLogout: PropTypes.func,
  handleFurniturePage: PropTypes.func,
  children: PropTypes.node,
  handleCart: PropTypes.func,
};
