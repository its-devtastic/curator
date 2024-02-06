import { DropdownMenuItem } from "@curatorjs/ui";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiWebhooksLogoBold } from "react-icons/pi";
import { Link } from "react-router-dom";

import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::webhooks.read" }),
  );

  return hasPermission ? (
    <DropdownMenuItem key="webhooks" asChild>
      <Link to="/settings/webhooks" className="space-x-2">
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-pink-100">
          <PiWebhooksLogoBold className="size-3" />
        </span>
        <span>{t("webhooks.title")}</span>
      </Link>
    </DropdownMenuItem>
  ) : null;
};

export default MainMenuItem;
