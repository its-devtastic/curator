import { Switch } from "antd";
import React from "react";

const BooleanField: React.FC<any> = ({
  value,
  onChange,
  attribute,
  field,
  ...props
}) => {
  return (
    <Switch {...props} checked={value} onChange={(value) => onChange(value)} />
  );
};

export default BooleanField;
