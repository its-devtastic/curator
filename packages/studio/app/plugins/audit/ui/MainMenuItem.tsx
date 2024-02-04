import { faBinoculars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiBinocularsBold } from "react-icons/pi";

import useStrapi from "@/hooks/useStrapi";
import MainMenu from "@/ui/MainMenu";

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
      icon={<PiBinocularsBold className="size-4" />}
    />
  ) : null;
};

export default MainMenuItem;
