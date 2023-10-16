import React from "react";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";
import * as R from "ramda";
import { List, Tag } from "antd";
import { useNavigate } from "react-router-dom";

import { RenderContext } from "@/types/contentTypeConfig";
import CalendarTime from "@/ui/CalendarTime";
import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";

const ItemList: React.FC<{ items?: any[] }> = ({ items = [] }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const config = useCurator();
  const { contentTypes } = useStrapi();

  return (
    <List
      dataSource={items}
      size="small"
      bordered={false}
      split={false}
      renderItem={(item: any) => {
        const apiID = contentTypes.find(R.whereEq({ uid: item.uid }))?.apiID;
        const contentType = config.contentTypes?.find(R.whereEq({ apiID }));

        return (
          <List.Item
            className="hover:bg-gray-50 dark:hover:bg-gray-600 select-none cursor-pointer last-of-type:rounded-b-lg"
            onClick={() => navigate(`/content-manager/${apiID}/${item.id}`)}
            extra={
              <Tag color="purple" bordered={false}>
                {
                  (contentType?.icon ||
                    (contentType?.name
                      ? t(contentType.name, { ns: "custom" })
                      : "")) as any
                }
              </Tag>
            }
          >
            <List.Item.Meta
              title={
                <span className="text-gray-700 dark:text-gray-300 font-semibold">
                  {contentType?.render?.(item, {
                    context: RenderContext.List,
                    t: ((key: string, opts: any) =>
                      t(key, { ns: "custom", ...opts })) as TFunction,
                  }) ??
                    (contentType?.titleField
                      ? item.attributes[contentType.titleField as string]
                      : "")}
                </span>
              }
              description={
                <span>
                  <span>{t("phrases.last_updated_at")}</span>{" "}
                  <CalendarTime>{item.attributes.updatedAt}</CalendarTime>
                </span>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ItemList;
