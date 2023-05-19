import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import MainMenu from "~/ui/MainMenu";

import MediaLibraryDrawer from "../ui/MediaLibraryDrawer";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <MainMenu.Item
        onClick={() => setOpen(true)}
        label={t("common.media_library")}
      />
      {open && (
        <MediaLibraryDrawer open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

export default MainMenuItem;
