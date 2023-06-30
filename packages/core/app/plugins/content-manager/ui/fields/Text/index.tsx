import React from "react";
import { Input } from "antd";

const TextField: React.FC<any> = ({
  value,
  onChange,
  attribute,
  field,
  ...props
}) => {
  return (
    <Input.TextArea
      autoSize={{ minRows: 3, maxRows: 12 }}
      {...props}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextField;
