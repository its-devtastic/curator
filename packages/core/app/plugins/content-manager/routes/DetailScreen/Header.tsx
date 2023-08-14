import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Entity } from "~/types/content";
import { StrapiContentType } from "~/types/contentType";
import { ContentTypeConfig } from "~/types/contentTypeConfig";
import CalendarTime from "~/ui/CalendarTime";

import Actions from "./Actions";

const Header: React.FC<HeaderProps> = ({ contentTypeConfig, document }) => {
  const { t } = useTranslation();

  return (
    <div className="pt-8 pb-4 flex flex-col gap-6 md:flex-row justify-between items-center">
      <div>
        <h1 className="mt-0 mb-2 text-3xl font-semibold text-gray-700">
          {contentTypeConfig.titleField
            ? document[contentTypeConfig.titleField]
            : `${t("common.edit")} ${t(contentTypeConfig?.name ?? "", {
                ns: "custom",
              }).toLowerCase()}`}
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
