import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import MainMenu from "~/ui/MainMenu";

const MainMenuItem: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Tooltip title={t("form_submissions.menu_item")} placement="right">
      <MainMenu.Item as={Link} to="/form-submissions">
        <FontAwesomeIcon icon={faPaperPlane} />
      </MainMenu.Item>
    </Tooltip>
  );
};

export default MainMenuItem;
