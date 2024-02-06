import { Input } from "antd";
import React from "react";

const StringField: React.FC<any> = ({
  value,
  onChange,
  attribute,
  field,
  ...props
}) => {
  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default StringField;
