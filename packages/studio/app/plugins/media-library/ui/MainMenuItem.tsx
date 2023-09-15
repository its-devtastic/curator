import React from "react";
import { useTranslation } from "react-i18next";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

import MainMenu from "@/ui/MainMenu";
import useStrapi from "@/hooks/useStrapi";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const { permissions } = useStrapi();
  const hasPermission = permissions.some(
    R.whereEq({ action: "plugin::upload.read" }),
  );

  return hasPermission ? (
    <MainMenu.Item
      to="/media-library"
      label={t("common.media_library")}
      icon={<FontAwesomeIcon icon={faImage} />}
    />
  ) : null;
};

export default MainMenuItem;
