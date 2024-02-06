import { Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const EnumerationField: React.FC<any> = ({
  attribute,
  field,
  renderItem,
  ...props
}) => {
  const { t } = useTranslation();

  return (
    <Select
      className="w-full"
      options={attribute.enum.map((option: string) => ({
        label: renderItem
          ? renderItem(option, {
              t: (s: string) => t(s, { ns: "custom" }),
            })
          : t(option, { ns: "custom" }),
        value: option,
      }))}
      {...props}
    />
  );
};

export default EnumerationField;
