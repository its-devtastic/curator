import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { StrapiContentType } from "~/types/contentType";
import { ContentTypeConfig } from "~/types/contentTypeConfig";
import { PluginOptions } from "~/plugins/content-manager/types";

import Actions from "./Actions";
import CalendarTime from "~/ui/CalendarTime";
import { useFormikContext } from "formik";

const Header: React.FC<HeaderProps> = ({
  apiID,
  contentType,
  contentTypeConfig,
  pluginOptions,
}) => {
  const { t } = useTranslation();
  const isSingleType = contentType?.kind === "singleType";
  const { values } = useFormikContext<any>();

  return (
    <div className="pt-12 pb-4 flex flex-col gap-6 lg:flex-row justify-between items-center">
      <div className="flex-1">
        {!isSingleType && (
          <Link
            to={`/content-manager/${apiID}`}
            className="hover:no-underline text-sm space-x-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{t("common.back")}</span>
          </Link>
        )}
      </div>
      <div>
        <h1 className="m-0 text-center flex-1 text-lg font-semibold text-gray-700">
          {`${t("common.edit")} ${t(contentTypeConfig?.name ?? "", {
            ns: "custom",
          }).toLowerCase()}`}
        </h1>
        <div className="text-xs text-center">
          {values.updatedAt && (
            <span className="text-gray-400 space-x-1">
              <span>{t("phrases.last_updated_at")}</span>
              <CalendarTime>{values.updatedAt}</CalendarTime>
              {values.updatedBy && (
                <>
                  <span>{t("common.by").toLowerCase()}</span>
                  <Link
                    to={`/team/${values.updatedBy.id}`}
                    className="inline-flex items-center gap-2"
                  >
                    {`${
                      [values.updatedBy.firstname, values.updatedBy.lastname]
                        .filter(Boolean)
                        .join(" ")
                        .trim() || values.updatedBy.username
                    }.`}
                  </Link>
                </>
              )}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center lg:justify-end">
        <Actions options={pluginOptions} />
      </div>
    </div>
  );
};

export default Header;

interface HeaderProps {
  apiID: string;
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
  pluginOptions: PluginOptions["edit"];
}
