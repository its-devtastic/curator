import { ContentTypeConfig } from "@curatorjs/types";
import { Badge, useFormContext } from "@curatorjs/ui";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CalendarTime from "@/ui/CalendarTime";

import Actions from "./Actions";

const Header: React.FC<HeaderProps> = ({ contentTypeConfig }) => {
  const { t } = useTranslation();
  const { formState } = useFormContext();
  const document = formState.defaultValues!;

  return (
    <div className="px-4 lg:px-12 py-6 flex flex-col gap-6 md:flex-row justify-between items-center border-b">
      <div className="flex flex-col items-center md:items-start">
        <div className="font-semibold text-xs flex items-center gap-2 text-muted-foreground mb-2">
          <span className="empty:hidden">{contentTypeConfig.icon}</span>
          {contentTypeConfig.name && (
            <span>{t(contentTypeConfig.name, { ns: "custom" })}</span>
          )}
        </div>

        <h1 className="text-3xl/tight font-bold flex items-center gap-4">
          {(contentTypeConfig.titleField &&
            document[contentTypeConfig.titleField]) ||
            `${t("common.edit")} ${t(contentTypeConfig?.name ?? "", {
              ns: "custom",
            }).toLowerCase()}`}
          {formState.isDirty && (
            <Badge variant="secondary">{t("common.edited")}</Badge>
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
}
