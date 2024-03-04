"use client";
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useFormContext,
} from "@curatorjs/ui";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as R from "ramda";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";
import LanguageSelect from "@/ui/LanguageSelect";

const LanguageSwitcher: React.FC = () => {
  const params = useParams();
  const apiID = params.apiID as string;
  const navigate = useNavigate();
  const { sdk, locales, contentTypes } = useStrapi();
  const { t, i18n } = useTranslation();
  const { watch, getValues } = useFormContext<any>();
  const isSingleType =
    contentTypes.find(R.whereEq({ apiID }))?.kind === "singleType";
  const locale = watch("locale");
  const localizations = watch("localizations");
  const untranslatedLocales = locales.filter(
    ({ code }) =>
      code !== locale && !localizations?.some(R.whereEq({ locale: code })),
  );
  const translatedLocales = locales.filter(
    ({ code }) =>
      code === locale || localizations?.some(R.whereEq({ locale: code })),
  );
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language],
  );

  return (
    <div>
      <Label className="mb-2 block">{t("common.translation_other")}</Label>
      <div className="flex items-center gap-1">
        <LanguageSelect
          className="w-52"
          locales={translatedLocales}
          value={locale}
          onValueChange={(locale) => {
            const localizationId = localizations?.find(
              R.whereEq({ locale }),
            )?.id;

            if (localizationId) {
              navigate(
                isSingleType
                  ? `/content-manager/${apiID}?locale=${locale}`
                  : `/content-manager/${apiID}/${
                      localizations?.find(R.whereEq({ locale }))?.id
                    }`,
              );
            }
          }}
        />
        {!R.isEmpty(untranslatedLocales) && (
          <Popover>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FontAwesomeIcon icon={faPlus} />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent>{t("phrases.add_translation")}</TooltipContent>
            </Tooltip>
            <PopoverContent className="p-0">
              <Command>
                <CommandInput placeholder={t("phrases.select_language")} />
                <CommandEmpty>{t("phrases.no_results")}</CommandEmpty>
                <CommandGroup>
                  {untranslatedLocales.map(({ code }) => (
                    <CommandItem
                      key={code}
                      onSelect={async () => {
                        const values = getValues();
                        const { id } = await sdk.save(
                          apiID,
                          {
                            localizations: [
                              ...values.localizations.map(R.prop("id")),
                              values.id,
                            ],
                            locale: code,
                            ...R.omit([
                              "id",
                              "locale",
                              "localizations",
                              "createdBy",
                              "updatedBy",
                            ])(values),
                          },
                          {
                            params: {
                              locale: code,
                              relatedEntityId: values.id,
                            },
                          },
                        );
                        navigate(`/content-manager/${apiID}/${id}`);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-sm fi fi-${
                            code.startsWith("en") ? "us" : code.split("-")[0]
                          }`}
                        />
                        <span>{languageNames.of(code)}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
