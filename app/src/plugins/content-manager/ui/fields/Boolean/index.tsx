import React from "react";
import { Switch } from "antd";

const BooleanField: React.FC<any> = ({ value, onChange }) => {
  return <Switch checked={value} onChange={(value) => onChange(value)} />;
};

export default BooleanField;
