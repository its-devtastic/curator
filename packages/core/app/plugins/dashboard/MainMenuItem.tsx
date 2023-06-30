import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import MainMenu from "~/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();

  return <MainMenu.Item as={Link} label={t("common.dashboard")} to="/" />;
};

export default MainMenuItem;
