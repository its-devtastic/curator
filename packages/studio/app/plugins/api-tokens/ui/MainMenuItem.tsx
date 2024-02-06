import { DropdownMenuItem } from "@curatorjs/ui";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiKeyBold } from "react-icons/pi";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::api-tokens.read" }),
  );

  return hasPermission ? (
    <DropdownMenuItem key="api-tokens" asChild>
      <Link to="/settings/api-tokens" className="space-x-2">
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-purple-100">
          <PiKeyBold className="size-3" />
        </span>
        <span>{t("api_tokens.title")}</span>
      </Link>
    </DropdownMenuItem>
  ) : null;
};

export default MainMenuItem;
