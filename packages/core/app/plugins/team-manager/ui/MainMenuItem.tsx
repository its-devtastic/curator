import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import * as R from "ramda";

import MainMenu from "~/ui/MainMenu";
import useStrapi from "~/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" })
  );

  return hasPermission ? (
    <MainMenu.Item as={Link} to="/team" label={t("team.title")} />
  ) : null;
};

export default MainMenuItem;
