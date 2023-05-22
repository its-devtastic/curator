import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import MainMenu from "~/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainMenu.Item
      as={Link}
      to="/media-library"
      label={t("common.media_library")}
    />
  );
};

export default MainMenuItem;
