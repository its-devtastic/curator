import React from "react";
import { Select, SelectProps } from "antd";
import classNames from "classnames";
import { useTranslation } from "react-i18next";

import useCurator from "@/hooks/useCurator";

const LocaleSelect: React.FC<SelectProps> = ({ className, ...props }) => {
  const { interfaceLanguages = [] } = useCurator();
  const { t } = useTranslation();

  return (
    <Select
      {...props}
      className={classNames("w-full", className)}
      options={interfaceLanguages.map((code) => ({
        label: (
          <div className="inline-flex items-center gap-3">
            <span
              className={`rounded-sm fi fi-${
                code.startsWith("en") ? "us" : code.split("-")[0]
              }`}
            />
            <span>{t(`locales.${code}`)}</span>
          </div>
        ),
        value: code,
      }))}
    />
  );
};

export default LocaleSelect;
