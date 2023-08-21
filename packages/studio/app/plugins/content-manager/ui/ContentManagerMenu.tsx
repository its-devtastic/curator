import React from "react";
import * as R from "ramda";
import { useTranslation } from "react-i18next";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";
import MainMenu from "@/ui/MainMenu";

const ContentManagerMenu: React.FC<{
  groups: { label: string; items: string[] }[];
}> = ({ groups }) => {
  const { t } = useTranslation();
  const { contentTypes } = useStrapi();
  const config = useCurator();

  return (
    <div className="space-y-8">
      {groups.map(({ label, items }, idx) => (
        <div key={idx}>
          {label && (
            <h4 className="pl-4 mt-0 mb-2 text-xs font-semibold uppercase text-gray-400 select-none">
              {t(label, { ns: "custom" })}
            </h4>
          )}
          <div className="space-y-1">
            {items
              .map((apiID) => contentTypes.find(R.whereEq({ apiID })))
              .filter((i): i is any => Boolean(i))
              .map(({ apiID, info }) => {
                const custom = config.contentTypes?.find(R.whereEq({ apiID }));

                return (
                  <MainMenu.Item
                    key={apiID}
                    icon={custom?.icon}
                    label={t(custom?.name || info.displayName, {
                      ns: "custom",
                    })}
                    to={`/content-manager/${apiID}`}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentManagerMenu;
