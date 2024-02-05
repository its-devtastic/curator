import { ContentTypeConfig, Entity } from "@curatorjs/types";
import { Tag } from "antd";
import { useFormikContext } from "formik";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CalendarTime from "@/ui/CalendarTime";

import Actions from "./Actions";

const Header: React.FC<HeaderProps> = ({ contentTypeConfig, document }) => {
  const { t } = useTranslation();
  const { dirty } = useFormikContext();

  return (
    <div className="pt-8 pb-4 flex flex-col gap-6 md:flex-row justify-between items-center">
      <div>
        <div className="font-semibold text-xs flex items-center gap-2 text-gray-400 mb-2">
          <span className="empty:hidden">{contentTypeConfig.icon}</span>
          {contentTypeConfig.name && (
            <span>{t(contentTypeConfig.name, { ns: "custom" })}</span>
          )}
        </div>

        <h1 className="mt-0 mb-2 text-3xl font-normal font-serif flex items-center gap-4">
          {contentTypeConfig.titleField
            ? document[contentTypeConfig.titleField]
            : `${t("common.edit")} ${t(contentTypeConfig?.name ?? "", {
                ns: "custom",
              }).toLowerCase()}`}
          {dirty && (
            <Tag color="yellow" bordered={false}>
              {t("common.edited")}
            </Tag>
          )}
        </h1>

        <div className="text-xs">
          {document.updatedAt && (
            <span className="text-gray-400 space-x-1">
              <span>{t("phrases.last_updated_at")}</span>
              <CalendarTime>{document.updatedAt}</CalendarTime>
              {document.updatedBy && (
                <>
                  <span>{t("common.by").toLowerCase()}</span>
                  <Link
                    to={`/team/${document.updatedBy.id}`}
                    className="link inline-flex items-center gap-2"
                  >
                    {`${
                      [
                        document.updatedBy.firstname,
                        document.updatedBy.lastname,
                      ]
                        .filter(Boolean)
                        .join(" ")
                        .trim() || document.updatedBy.username
                    }.`}
                  </Link>
                </>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center lg:justify-end">
        <Actions contentTypeConfig={contentTypeConfig} />
      </div>
    </div>
  );
};

export default Header;

interface HeaderProps {
  contentTypeConfig: ContentTypeConfig;
  document: Omit<Entity, "id">;
}
