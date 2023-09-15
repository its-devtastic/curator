import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBinoculars } from "@fortawesome/free-solid-svg-icons";

import MainMenu from "@/ui/MainMenu";
import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.read",
      subject: "plugin::curator.curator-audit-log",
    }),
  );

  return hasPermission ? (
    <MainMenu.Item
      to="/audit"
      label={t("audit.title")}
      icon={<FontAwesomeIcon icon={faBinoculars} />}
    />
  ) : null;
};

export default MainMenuItem;
