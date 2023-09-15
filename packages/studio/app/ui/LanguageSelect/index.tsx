import React, { useMemo } from "react";
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
  const { i18n } = useTranslation();
  const options = locales ?? defaultLocales;
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language],
  );

  return (
    <Select
      {...props}
      value={value ?? options.find(R.whereEq({ isDefault: true }))?.code}
      options={options.map(({ code }) => ({
        label: (
          <div className="inline-flex items-center gap-3">
            <span
              className={`rounded-sm fi fi-${
                code.startsWith("en") ? "us" : code.split("-")[0]
              }`}
            />
            <span>{languageNames.of(code)}</span>
          </div>
        ),
        value: code,
      }))}
    />
  );
};

export default LanguageSelect;
