import { Input } from "antd";
import React from "react";

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
