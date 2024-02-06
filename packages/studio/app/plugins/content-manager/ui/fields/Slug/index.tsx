import { Input } from "antd";
import React from "react";
import slugify from "slugify";

const SlugField: React.FC<any> = ({
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
      onChange={(e) =>
        onChange(slugify(e.target.value, { lower: true, trim: false }))
      }
    />
  );
};

export default SlugField;
