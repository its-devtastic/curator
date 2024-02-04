import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiUsersThreeBold } from "react-icons/pi";

import useStrapi from "@/hooks/useStrapi";
import MainMenu from "@/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" }),
  );

  return hasPermission ? (
    <MainMenu.Item
      to="/team"
      label={t("team.title")}
      icon={<PiUsersThreeBold className="size-4" />}
    />
  ) : null;
};

export default MainMenuItem;
