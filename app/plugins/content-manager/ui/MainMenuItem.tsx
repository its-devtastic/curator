import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import MainMenu from "~/ui/MainMenu";
import Popover from "~/ui/Popover";

import ContentManagerMenu from "./ContentManagerMenu";

const MainMenuItem: React.FC<{
  groups: { label: string; items: string[] }[];
}> = ({ groups }) => {
  const { t } = useTranslation();

  return (
    <Popover
      key="contentManager"
      content={(close) => (
        <ContentManagerMenu groups={groups} onSelect={close} />
      )}
      trigger={["click"]}
      placement="bottomLeft"
    >
      <MainMenu.Item
        label={
          <>
            {t("common.content")}
            <FontAwesomeIcon icon={faCaretDown} />
          </>
        }
      />
    </Popover>
  );
};

export default MainMenuItem;
