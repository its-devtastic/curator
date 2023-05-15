import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShapes } from "@fortawesome/free-solid-svg-icons";

import MainMenu from "~/ui/MainMenu";
import Popover from "~/ui/Popover";

import ContentManagerMenu from "./ContentManagerMenu";

const MainMenuItem: React.FC<{
  groups: { label: string; items: string[] }[];
}> = ({ groups }) => (
  <Popover
    key="contentManager"
    content={(close) => <ContentManagerMenu groups={groups} onSelect={close} />}
    trigger={["hover"]}
    placement="rightTop"
  >
    <MainMenu.Item>
      <FontAwesomeIcon icon={faShapes} />
    </MainMenu.Item>
  </Popover>
);

export default MainMenuItem;
