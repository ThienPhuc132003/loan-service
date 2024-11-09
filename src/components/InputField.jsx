import React from "react";
import PropTypes from "prop-types";

const InputFieldCompo = (props) => {
  const { value, className, errorMessage, name, ...rest } = props;
  return (
    <input
      value={value}
      className={className}
      placeholder={errorMessage ? errorMessage : name}
      {...rest}
    />
  );
};

const InputField = React.memo(InputFieldCompo);
export default InputField;

InputFieldCompo.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  errorMessage: PropTypes.string,
  name: PropTypes.string,
};
