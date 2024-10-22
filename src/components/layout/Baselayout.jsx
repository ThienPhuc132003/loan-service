import React from "react";
import Navbar from "../Navbar";
import PropTypes from "prop-types";

const BaseLayoutCompo = (props) => {
  const { showLogin = false, children = null, showBreadCrumbs = true } = props;
  return (
    <>
      <Navbar showLogin={showLogin} showBreadCrumbs={showBreadCrumbs} />
      {children}
    </>
  );
};
const BaseLayout = React.memo(BaseLayoutCompo);
export default BaseLayout;
BaseLayoutCompo.propTypes = {
  showLogin: PropTypes.bool,
  showBreadCrumbs: PropTypes.bool,
  handleLogout: PropTypes.func,
  handleFurniturePage: PropTypes.func,
  children: PropTypes.node,
  handleCart: PropTypes.func,
};
