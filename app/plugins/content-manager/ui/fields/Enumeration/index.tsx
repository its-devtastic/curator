import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const EnumerationField: React.FC<any> = ({ attribute, field, ...props }) => {
  const { t } = useTranslation();

  return (
    <Select
      className="w-full"
      options={attribute.enum.map((option: string) => ({
        label: field.renderItem
          ? field.renderItem(option, { t })
          : t(option, { ns: "custom" }),
        value: option,
      }))}
      {...props}
    />
  );
};

export default EnumerationField;
