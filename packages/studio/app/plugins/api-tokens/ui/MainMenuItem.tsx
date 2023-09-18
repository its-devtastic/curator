import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::api-tokens.read" }),
  );

  return hasPermission ? (
    <Link to="/settings/api-tokens" className="space-x-2">
      <FontAwesomeIcon icon={faKey} />
      <span>{t("api_tokens.title")}</span>
    </Link>
  ) : null;
};

export default MainMenuItem;
