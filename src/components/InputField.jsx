import React from "react";
import Proptypes from "prop-types";
const InputFieldCompo=({ value, className, ...rest })=> {
  return <input value={value} className={className}{...rest} />;
}
const InputField =React.memo(InputFieldCompo);
export default InputField

InputFieldCompo.propTypes = {
  value: Proptypes.string,
  className: Proptypes.string,
};
