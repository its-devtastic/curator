import { Button, Tooltip, TooltipContent, TooltipTrigger } from "@curatorjs/ui";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useTranslation } from "react-i18next";

import usePreferences from "@/hooks/usePreferences";

const DarkModeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { preferences, setPreference } = usePreferences();

  return (
    <div className="">
      <Tooltip>
        <TooltipContent>
          {preferences.darkMode
            ? t("phrases.switch_to_light_mode")
            : t("phrases.switch_to_dark_mode")}
        </TooltipContent>
        <TooltipTrigger>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPreference("darkMode", !preferences.darkMode)}
          >
            <FontAwesomeIcon icon={faCircleHalfStroke} />
          </Button>
        </TooltipTrigger>
      </Tooltip>
    </div>
  );
};

export default DarkModeToggle;
