import React from "react";
import propTypes from "prop-types";
const Avatar = React.memo(({ src, alt, className, ...rest }) => {
  return (
    <>
      <img src={src} alt={alt} className={className} {...rest} />
    </>
  );
});
Avatar.displayName = "Avatar";
Avatar.propTypes = {
  src: propTypes.string,
  alt: propTypes.string,
  className: propTypes.string,
};
export default Avatar;
