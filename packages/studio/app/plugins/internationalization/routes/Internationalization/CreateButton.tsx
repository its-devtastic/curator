import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { notification, Select } from "antd";
import * as R from "ramda";
import { useAsync } from "react-use";

import useStrapi from "@/hooks/useStrapi";

export default function CreateButton() {
  const { t } = useTranslation();
  const elRef = useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const { sdk, permissions, locales, refresh } = useStrapi();
  const canCreate = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.create" }),
  );

  const { value: availableLocales = [] } = useAsync(async () => {
    try {
      return await sdk.getIsoLocales();
    } catch (e) {
      console.error(e);
    }
  }, [sdk]);

  const create = useCallback(async (code: string, name: string) => {
    try {
      setLoading(true);
      await sdk.createLocale(code, name);
      // Reload available locales into Strapi context
      await refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  return canCreate ? (
    <Select
      ref={elRef}
      className="w-[280px]"
      placeholder={t("internationalization.add")}
      showSearch
      filterOption={(inputValue, option) =>
        !!option?.text?.toLowerCase().includes(inputValue.trim().toLowerCase())
      }
      onChange={async (value: string, { text }: any) => {
        elRef.current?.blur();
        await create(value, text);
        notification.success({
          message: t("internationalization.locale_added", { locale: text }),
        });
      }}
      loading={loading}
      value={null}
      options={availableLocales
        .filter(
          R.where({
            code: (code: string) => !locales.some(R.whereEq({ code })),
          }),
        )
        .map(({ code, name }) => ({
          key: code,
          value: code,
          text: name,
          label: (
            <div className="flex items-center gap-2">
              <span
                className={`flex-none rounded-sm w-4 h-4 fi fi-${
                  code.startsWith("en") ? "us" : code.split("-")[0]
                }`}
              />
              <span className="truncate">{name}</span>
            </div>
          ),
        }))}
    />
  ) : null;
}
