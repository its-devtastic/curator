import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import MainMenu from "~/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <MainMenu.Item
      as={Link}
      to="/form-submissions"
      label={t("form_submissions.menu_item")}
    />
  );
};

export default MainMenuItem;
