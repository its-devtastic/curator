import React from "react";
import { Select } from "antd";
import { useTranslation } from "react-i18next";

const EnumerationField: React.FC<any> = ({ config, error, name, ...props }) => {
  const { t } = useTranslation();

  return (
    <Select
      className="w-full"
      options={config.enum.map((option: string) => ({
        label: config.renderItem
          ? config.renderItem(option, { t })
          : t(option, { ns: "custom" }),
        value: option,
      }))}
      {...props}
    />
  );
};

export default EnumerationField;
