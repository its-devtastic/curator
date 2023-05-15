import React from "react";
import { Input } from "antd";

const StringField: React.FC<any> = ({ value, onChange }) => {
  return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
};

export default StringField;
