import React, { useState } from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input, Typography } from "antd";

import useCurator from "~/hooks/useCurator";
import useStrapi from "~/hooks/useStrapi";
import useModifierKey from "~/hooks/useModifierKey";

const ContentManagerMenu: React.FC<{
  groups: { label: string; items: string[] }[];
  onSelect?: VoidFunction;
}> = ({ groups, onSelect }) => {
  const { t } = useTranslation();
  const { contentTypes } = useStrapi();
  const config = useCurator();
  const modifierKey = useModifierKey();
  const [search, setSearch] = useState("");

  return (
    <div className="w-[600px] max-w-full">
      <div className="p-4 bg-gray-50 border-0 border-solid border-b border-gray-200 rounded-t-md">
        <Input.Search
          ref={(ref) => setTimeout(() => ref?.focus(), 0)}
          onSearch={setSearch}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("common.search")}
        />
      </div>
      <div className="space-y-8 p-4">
        {groups.map(({ label, items }, idx) => (
          <div key={idx}>
            {label && (
              <h4 className="pl-3 mb-3 mt-0 text-sm font-bold text-gray-900 select-none">
                {t(label, { ns: "custom" })}
              </h4>
            )}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              {items
                .map((apiID) => contentTypes.find(R.whereEq({ apiID })))
                .filter((i): i is any => Boolean(i))
                .map(({ apiID, info }) => {
                  const custom = config.contentTypes?.find(
                    R.whereEq({ apiID })
                  );
                  const show = [
                    custom?.name,
                    info.displayName,
                    custom?.description,
                  ]
                    .filter(Boolean)
                    .join("")
                    .toLowerCase()
                    .includes(search.toLowerCase());

                  return show ? (
                    <Link
                      key={apiID}
                      onClick={() => onSelect?.()}
                      to={`/content-manager/${apiID}`}
                      className="group hover:bg-gray-100 rounded-lg p-3 select-none"
                    >
                      <div className="flex items-center gap-3">
                        {custom?.icon && (
                          <div className="flex-none text-gray-500">
                            {custom.icon}
                          </div>
                        )}
                        <div className="text-sm font-semibold text-gray-700">
                          {t(custom?.name || info.displayName, {
                            ns: "custom",
                          })}
                        </div>
                      </div>
                      {custom?.description && (
                        <div className="text-sm text-gray-500">
                          {t(custom.description, { ns: "custom" })}
                        </div>
                      )}
                    </Link>
                  ) : null;
                })}
            </div>
          </div>
        ))}
      </div>
      <div className="border-solid border-0 border-t border-gray-200 bg-gray-50 px-4 py-2 flex items-center justify-end gap-2 select-none rounded-b-md">
        <span className="text-xs text-gray-600">
          {t("phrases.open_this_menu")}
        </span>
        <Typography.Text keyboard>{`${modifierKey.label}+L`}</Typography.Text>
      </div>
    </div>
  );
};

export default ContentManagerMenu;
