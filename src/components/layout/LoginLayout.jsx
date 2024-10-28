import logoAlpha from "../../assets/images/logoAlpha.png";
import React from "react";
import PropTypes from "prop-types";
const LoginLayoutComponent = (props) => {
  const { children = null } = props;
  return (
    <>
      <img src={logoAlpha} alt="logo" className="logoAlpha" />
      {children}
    </>
  );
};

LoginLayoutComponent.propTypes = {
  children: PropTypes.node,
};

const LoginLayout = React.memo(LoginLayoutComponent);
export default LoginLayout;
