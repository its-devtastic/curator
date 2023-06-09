import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { StrapiContentType } from "~/types/contentType";
import { ContentTypeConfig } from "~/types/contentTypeConfig";

const Header: React.FC<HeaderProps> = ({
  apiID,
  contentType,
  contentTypeConfig,
}) => {
  const { t } = useTranslation();
  const isSingleType = contentType?.kind === "singleType";

  return (
    <div className="py-4 border-b border-0 border-dashed border-slate-200 flex justify-between items-center">
      <div className="flex-1">
        {!isSingleType && (
          <Link
            to={`/content-manager/${apiID}`}
            className="text-blue-600 no-underline text-sm space-x-2"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>{t("common.back")}</span>
          </Link>
        )}
      </div>
      <h1 className="m-0 text-right lg:text-center flex-1 text-lg font-semibold text-gray-700">
        {`${t("common.edit")} ${t(contentTypeConfig?.name ?? "", {
          ns: "custom",
        }).toLowerCase()}`}
      </h1>
      <div className="flex-1 flex items-center justify-center lg:justify-end">
        buttons
      </div>
    </div>
  );
};

export default Header;

interface HeaderProps {
  apiID: string;
  contentType: StrapiContentType;
  contentTypeConfig: ContentTypeConfig;
}
