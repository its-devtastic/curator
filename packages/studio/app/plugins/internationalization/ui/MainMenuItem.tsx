import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLanguage } from "@fortawesome/free-solid-svg-icons";

import MainMenu from "@/ui/MainMenu";
import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::i18n.locale.read" })
  );

  return hasPermission ? (
    <MainMenu.Item
      to="/settings/internationalization"
      label={t("internationalization.title")}
      icon={<FontAwesomeIcon icon={faLanguage} />}
    />
  ) : null;
};

export default MainMenuItem;
