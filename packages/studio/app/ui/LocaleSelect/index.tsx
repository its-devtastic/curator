import {
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@curatorjs/ui";
import React from "react";
import { useTranslation } from "react-i18next";

import useCurator from "@/hooks/useCurator";

export default function LocaleSelect({
  className,
  value,
  onChange,
}: LocaleSelectProps) {
  const { interfaceLanguages = [] } = useCurator();
  const { t } = useTranslation();

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger className={className}>
        {value ? (
          <div className="inline-flex items-center gap-3">
            <span
              className={`rounded-sm fi fi-${
                value.startsWith("en") ? "us" : value.split("-")[0]
              }`}
            />
            <span>{t(`locales.${value}`)}</span>
          </div>
        ) : (
          <SelectValue placeholder={t("phrases.select_language")} />
        )}
      </SelectTrigger>
      <SelectContent>
        {interfaceLanguages.map((code) => (
          <SelectItem key={code} value={code}>
            <div className="inline-flex items-center gap-3">
              <span
                className={`rounded-sm fi fi-${
                  code.startsWith("en") ? "us" : code.split("-")[0]
                }`}
              />
              <span>{t(`locales.${code}`)}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface LocaleSelectProps {
  value?: string;

  onChange?(value: string): void;

  className?: string;
}
