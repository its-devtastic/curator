import { StrapiLocale } from "@curatorjs/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@curatorjs/ui";
import * as R from "ramda";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import useStrapi from "@/hooks/useStrapi";

const LanguageSelect: React.FC<{
  locales?: StrapiLocale[];
  value?: string | null;
  onValueChange?(value: string): void;
  className?: string;
}> = ({ value, locales, className, ...props }) => {
  const { locales: defaultLocales } = useStrapi();
  const { i18n } = useTranslation();
  const options = locales ?? defaultLocales;
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language],
  );
  const code = value ?? options.find(R.whereEq({ isDefault: true }))?.code;

  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        {code && (
          <div className="inline-flex items-center gap-3">
            <span
              className={`rounded-sm fi fi-${
                code.startsWith("en") ? "us" : code.split("-")[0]
              }`}
            />
            <span>{languageNames.of(code)}</span>
          </div>
        )}
      </SelectTrigger>
      <SelectValue>
        {code && (
          <div className="inline-flex items-center gap-3">
            <span
              className={`rounded-sm fi fi-${
                code.startsWith("en") ? "us" : code.split("-")[0]
              }`}
            />
            <span>{languageNames.of(code)}</span>
          </div>
        )}
      </SelectValue>
      <SelectContent>
        {options.map(({ code }) => (
          <SelectItem key={code} value={code}>
            <div className="inline-flex items-center gap-3">
              <span
                className={`rounded-sm fi fi-${
                  code.startsWith("en") ? "us" : code.split("-")[0]
                }`}
              />
              <span>{languageNames.of(code)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
