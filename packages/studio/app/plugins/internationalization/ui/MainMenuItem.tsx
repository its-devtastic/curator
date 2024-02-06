import { DropdownMenuItem } from "@curatorjs/ui";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiTranslateBold } from "react-icons/pi";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.read" }),
  );

  return hasPermission ? (
    <DropdownMenuItem key="internationalization" asChild>
      <Link to="/settings/internationalization" className="space-x-2">
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-cyan-100">
          <PiTranslateBold className="size-3" />
        </span>
        <span>{t("internationalization.title")}</span>
      </Link>
    </DropdownMenuItem>
  ) : null;
};

export default MainMenuItem;
