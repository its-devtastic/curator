import React, { useState } from "react";
import { Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhotoFilm } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import MainMenu from "~/ui/MainMenu";

import MediaLibraryDrawer from "../ui/MediaLibraryDrawer";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title={t("common.media_library")} placement="right">
        <MainMenu.Item onClick={() => setOpen(true)}>
          <FontAwesomeIcon icon={faPhotoFilm} />
        </MainMenu.Item>
      </Tooltip>
      {open && (
        <MediaLibraryDrawer open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default MainMenuItem;
