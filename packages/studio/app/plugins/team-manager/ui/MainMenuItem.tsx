import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

import MainMenu from "~/ui/MainMenu";
import useStrapi from "~/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "admin::users.read" })
  );

  return hasPermission ? (
    <MainMenu.Item
      to="/team"
      label={t("team.title")}
      icon={<FontAwesomeIcon icon={faUsers} />}
    />
  ) : null;
};

export default MainMenuItem;
