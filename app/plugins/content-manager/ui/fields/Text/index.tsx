import React from "react";
import { Input } from "antd";

const TextField: React.FC<any> = ({ value, onChange }) => {
  return (
    <Input.TextArea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoSize={{ minRows: 3, maxRows: 12 }}
    />
  );
};

export default TextField;
