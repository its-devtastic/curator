import React from "react";
import { Input } from "antd";

const EmailField: React.FC<any> = ({ value, onChange }) => {
  return (
    <Input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default EmailField;
