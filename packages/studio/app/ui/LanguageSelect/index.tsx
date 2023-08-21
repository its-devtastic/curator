import React from "react";
import { Select, SelectProps } from "antd";
import { useTranslation } from "react-i18next";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";
import { StrapiLocale } from "@/types/locales";

const LanguageSelect: React.FC<SelectProps & { locales?: StrapiLocale[] }> = ({
  value,
  locales,
  ...props
}) => {
  const { locales: defaultLocales } = useStrapi();
  const { t } = useTranslation();
  const options = locales ?? defaultLocales;

  return (
    <Select
      {...props}
      value={value ?? options.find(R.whereEq({ isDefault: true }))?.code}
      options={options.map(({ code }) => ({
        label: (
          <div className="flex items-center gap-3">
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

export default LanguageSelect;
