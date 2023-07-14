import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useKey } from "react-use";

import MainMenu from "~/ui/MainMenu";
import Popover from "~/ui/Popover";
import useModifierKey from "~/hooks/useModifierKey";

import ContentManagerMenu from "./ContentManagerMenu";

const MainMenuItem: React.FC<{
  groups: { label: string; items: string[] }[];
}> = ({ groups }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const modifierKey = useModifierKey();
  useKey(
    "l",
    (e) => {
      if (e[modifierKey.value]) {
        e.preventDefault();
        setOpen(true);
      }
    },
    {},
    [modifierKey.value]
  );
  useKey("Escape", () => setOpen(false));

  return (
    <Popover
      key="contentManager"
      overlayInnerStyle={{ padding: 0 }}
      open={open}
      onOpenChange={setOpen}
      destroyTooltipOnHide
      content={() => (
        <ContentManagerMenu groups={groups} onSelect={() => setOpen(false)} />
      )}
      trigger={["click"]}
      placement="bottom"
    >
      <MainMenu.Item
        isActive={open}
        label={
          <>
            {t("phrases.manage_content")}
            <FontAwesomeIcon icon={faCaretDown} />
          </>
        }
      />
    </Popover>
  );
};

export default MainMenuItem;
