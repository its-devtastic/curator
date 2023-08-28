"use client";
import React, { useMemo } from "react";
import * as R from "ramda";
import { useFormikContext } from "formik";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Dropdown, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import LanguageSelect from "@/ui/LanguageSelect";
import useStrapi from "@/hooks/useStrapi";

const LanguageSwitcher: React.FC = () => {
  const params = useParams();
  const apiID = params.apiID as string;
  const navigate = useNavigate();
  const { sdk, locales, contentTypes } = useStrapi();
  const { t, i18n } = useTranslation();
  const { values } = useFormikContext<any>();
  const isSingleType =
    contentTypes.find(R.whereEq({ apiID }))?.kind === "singleType";
  const untranslatedLocales = locales.filter(
    ({ code }) =>
      code !== values.locale &&
      !values.localizations?.some(R.whereEq({ locale: code }))
  );
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language]
  );

  return (
    <div className="space-x-2">
      <LanguageSelect
        className="w-52"
        locales={locales.filter(
          ({ code }) =>
            code === values.locale ||
            values.localizations?.some(R.whereEq({ locale: code }))
        )}
        value={values.locale}
        onChange={(locale) => {
          const localizationId = values.localizations?.find(
            R.whereEq({ locale })
          )?.id;

          if (localizationId) {
            navigate(
              isSingleType
                ? `/content-manager/${apiID}?locale=${locale}`
                : `/content-manager/${apiID}/${
                    values.localizations?.find(R.whereEq({ locale }))?.id
                  }`
            );
          }
        }}
      />
      {!R.isEmpty(untranslatedLocales) && (
        <Dropdown
          trigger={["click"]}
          placement="bottomRight"
          menu={{
            items: untranslatedLocales.map(({ code }) => ({
              label: (
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-sm fi fi-${
                      code.startsWith("en") ? "us" : code.split("-")[0]
                    }`}
                  />
                  <span>{languageNames.of(code)}</span>
                </div>
              ),
              key: code,
              async onClick() {
                const { id } = await sdk.save(
                  apiID,
                  {
                    ...R.omit(["id", "locale"])(values),
                  },
                  {
                    params: {
                      "plugins[i18n][locale]": code,
                      "plugins[i18n][relatedEntityId]": values.id,
                    },
                  }
                );
                navigate(`/content-manager/${apiID}/${id}`);
              },
            })),
          }}
        >
          <Tooltip title={t("phrases.add_translation")}>
            <Button type="text" icon={<FontAwesomeIcon icon={faPlus} />} />
          </Tooltip>
        </Dropdown>
      )}
    </div>
  );
};

export default LanguageSwitcher;
