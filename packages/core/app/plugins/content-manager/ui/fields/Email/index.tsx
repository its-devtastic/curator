import React from "react";
import { Input } from "antd";

const EmailField: React.FC<any> = ({
  value,
  onChange,
  attribute,
  field,
  ...props
}) => {
  return (
    <Input
      {...props}
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default EmailField;
