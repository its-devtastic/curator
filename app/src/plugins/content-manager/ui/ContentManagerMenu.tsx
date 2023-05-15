import React from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useStrapion from "~/hooks/useStrapion";
import useStrapi from "~/hooks/useStrapi";

const ContentManagerMenu: React.FC<{
  groups: { label: string; items: string[] }[];
  onSelect?: VoidFunction;
}> = ({ groups, onSelect }) => {
  const { t } = useTranslation();
  const { contentTypes } = useStrapi();
  const config = useStrapion();

  return (
    <div className="w-[600px] max-w-full">
      <div className="space-y-6 py-3">
        {groups.map(({ label, items }, idx) => (
          <div key={idx}>
            {label && (
              <h4 className="pl-3 mb-3 mt-0 uppercase text-xs text-slate-500">
                {t(label, { ns: "custom" })}
              </h4>
            )}
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              {items
                .map((apiID) => contentTypes.find(R.whereEq({ apiID })))
                .filter((i): i is any => Boolean(i))
                .map(({ apiID, info }) => {
                  const custom = config.contentTypes.find(R.whereEq({ apiID }));

                  return (
                    <Link
                      key={apiID}
                      onClick={() => onSelect?.()}
                      to={`/content-manager/${apiID}`}
                      className="group flex items-center gap-3 hover:bg-slate-100 rounded-lg p-3 select-none"
                    >
                      {custom?.icon && (
                        <div className="flex-none text-slate-500">
                          {custom.icon}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-semibold text-slate-600 group-hover:text-slate-600">
                          {t(custom?.name || info.displayName, {
                            ns: "custom",
                          })}
                        </div>
                        {custom?.description && (
                          <div className="text-xs text-slate-500">
                            {t(custom.description, { ns: "custom" })}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManagerMenu;
