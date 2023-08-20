import React from "react";
import { Button, Tooltip } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import usePreferences from "~/hooks/usePreferences";

const DarkModeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { preferences, setPreference } = usePreferences();

  return (
    <div className="">
      <Tooltip
        placement="bottomRight"
        title={
          preferences.darkMode
            ? t("phrases.switch_to_light_mode")
            : t("phrases.switch_to_dark_mode")
        }
      >
        <Button
          type="text"
          icon={<FontAwesomeIcon icon={faCircleHalfStroke} />}
          onClick={() => setPreference("darkMode", !preferences.darkMode)}
        />
      </Tooltip>
    </div>
  );
};

export default DarkModeToggle;
