import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.read" }),
  );

  return hasPermission ? (
    <Link to="/settings/internationalization" className="space-x-2">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-100">
        <FontAwesomeIcon className="text-cyan-500 text-sm" icon={faLanguage} />
      </span>
      <span>{t("internationalization.title")}</span>
    </Link>
  ) : null;
};

export default MainMenuItem;
