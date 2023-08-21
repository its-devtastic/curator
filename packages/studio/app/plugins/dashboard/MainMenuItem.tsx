import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";

import MainMenu from "@/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainMenu.Item
      label={t("common.dashboard")}
      to="/"
      icon={<FontAwesomeIcon icon={faHome} />}
    />
  );
};

export default MainMenuItem;
