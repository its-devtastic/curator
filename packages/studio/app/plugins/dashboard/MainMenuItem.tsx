import React from "react";
import { useTranslation } from "react-i18next";
import { PiHouseBold } from "react-icons/pi";

import MainMenu from "@/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainMenu.Item
      label={t("common.dashboard")}
      to="/"
      icon={<PiHouseBold className="size-4" />}
    />
  );
};

export default MainMenuItem;
