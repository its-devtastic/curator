import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import * as R from "ramda";

import useStrapi from "@/hooks/useStrapi";
import Table from "@/ui/Table";

import CreateButton from "./CreateButton";

export default function Internationalization() {
  const { t, i18n } = useTranslation();
  const { locales } = useStrapi();
  const languageNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: "language" }),
    [i18n.language]
  );

  return (
    <div className="px-4 md:px-12">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 my-12 pb-6 border-b border-0 border-solid border-gray-200">
        <div className="text-center lg:text-left">
          <h1 className="mt-0 mb-4">{t("internationalization.title")}</h1>
          <div className="text-sm text-gray-600">
            {t("internationalization.description")}
          </div>
        </div>
        <CreateButton />
      </div>
      <Table
        dataSource={R.sortWith([R.ascend(R.prop("name"))], locales)}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        columns={[
          {
            key: "name",
            dataIndex: "code",
            title: t("common.name"),
            render(code) {
              return (
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-sm fi fi-${
                      code.startsWith("en") ? "us" : code.split("-")[0]
                    }`}
                  />
                  {languageNames.of(code)}
                </div>
              );
            },
          },
          {
            key: "isDefault",
            dataIndex: "isDefault",
            title: t("phrases.is_default"),
            render(isDefault) {
              return isDefault ? (
                <FontAwesomeIcon icon={faCheck} className="text-emerald-400" />
              ) : null;
            },
          },
        ]}
      />
    </div>
  );
}
