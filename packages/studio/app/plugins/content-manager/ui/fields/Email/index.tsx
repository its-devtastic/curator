import { Input } from "antd";
import React from "react";

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
