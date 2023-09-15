import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
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
      <FontAwesomeIcon icon={faLanguage} />
      <span>{t("internationalization.title")}</span>
    </Link>
  ) : null;
};

export default MainMenuItem;
