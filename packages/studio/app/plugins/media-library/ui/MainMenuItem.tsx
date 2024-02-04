import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiImagesFill } from "react-icons/pi";

import useStrapi from "@/hooks/useStrapi";
import MainMenu from "@/ui/MainMenu";

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
      icon={<PiImagesFill className="size-4" />}
    />
  ) : null;
};

export default MainMenuItem;
