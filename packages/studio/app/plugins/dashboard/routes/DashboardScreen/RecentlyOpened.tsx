import React from "react";
import { useTranslation } from "react-i18next";
import { useAsync } from "react-use";
import { List } from "antd";
import { useNavigate } from "react-router-dom";
import * as R from "ramda";
import { TFunction } from "i18next";

import { RenderContext } from "@/types/contentTypeConfig";
import useDashboard from "@/plugins/dashboard/useDashboard";
import useStrapi from "@/hooks/useStrapi";
import CalendarTime from "@/ui/CalendarTime";
import useCurator from "@/hooks/useCurator";

const RecentlyOpened: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { sdk } = useStrapi();
  const config = useCurator();
  const recentlyOpened = useDashboard((state) => state.recentlyOpened);
  const hash = recentlyOpened.reduce(
    (result, { apiID, id }) => result + apiID + id,
    ""
  );

  const { value = [] } = useAsync(async () => {
    const all = await Promise.all(
      recentlyOpened.map(async ({ apiID, id }) => {
        try {
          const item = await sdk.getOne(apiID, Number(id));
          return { apiID, ...item };
        } catch (e) {}
      })
    );
    return all.filter(Boolean);
  }, [hash]);

  return (
    <div className="shadow-lg shadow-gray-700/5 dark:shadow-gray-900/20 border border-solid border-gray-200 dark:border-gray-500 rounded-lg dark:bg-gray-700">
      <h2 className="m-0 px-4 py-2 text-lg border-0 border-solid border-b border-gray-200 dark:border-gray-500">
        {t("dashboard.recently_opened")}
      </h2>
      <List
        dataSource={value}
        size="small"
        renderItem={(item: any) => {
          const contentType = config.contentTypes?.find(
            R.whereEq({ apiID: item.apiID })
          );
          return (
            <List.Item
              className="hover:bg-gray-50 dark:hover:bg-gray-600 select-none cursor-pointer last-of-type:rounded-b-lg"
              onClick={() =>
                navigate(`/content-manager/${item.apiID}/${item.id}`)
              }
              extra={
                <span className="text-indigo-400">
                  {contentType?.icon
                    ? contentType.icon
                    : contentType?.name
                    ? t(contentType.name, { ns: "custom" })
                    : ""}
                </span>
              }
            >
              <List.Item.Meta
                title={
                  <span className="text-gray-700 dark:text-gray-300">
                    {contentType?.render?.(item, {
                      context: RenderContext.List,
                      t: ((key: string, opts: any) =>
                        t(key, { ns: "custom", ...opts })) as TFunction,
                    }) ?? item.title}
                  </span>
                }
                description={
                  <span>
                    <span>{t("phrases.last_updated_at")}</span>{" "}
                    <CalendarTime>{item.updatedAt}</CalendarTime>
                  </span>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default RecentlyOpened;
