import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::webhooks.read" }),
  );

  return hasPermission ? (
    <Link to="/settings/webhooks" className="space-x-3">
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-pink-100">
        <FontAwesomeIcon className="text-pink-500" icon={faCircleNodes} />
      </span>
      <span>{t("webhooks.title")}</span>
    </Link>
  ) : null;
};

export default MainMenuItem;
