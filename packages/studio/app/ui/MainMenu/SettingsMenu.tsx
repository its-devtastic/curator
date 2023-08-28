import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, Typography } from "antd";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBook,
  faCog,
  faKeyboard,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { InjectionZone } from "@/types/config";
import useSession from "@/hooks/useSession";
import useCurator from "@/hooks/useCurator";

import MainMenuItem from "./MainMenuItem";

const SettingsMenu: React.FC = () => {
  const { t } = useTranslation();
  const { user, clearSession } = useSession();
  const config = useCurator();
  const navigate = useNavigate();
  const items = R.sortBy(R.prop("weight"))(
    config.zones?.filter(
      R.whereEq({
        zone: InjectionZone.MainMenuSettings,
      })
    ) ?? []
  );

  return user ? (
    <Dropdown
      trigger={["click"]}
      placement="topRight"
      menu={{
        items: items.map((item, index) => ({
          key: index,
          label: item.render(),
        })),
      }}
    >
      <div>
        <MainMenuItem
          to="#"
          label={t("common.settings")}
          icon={<FontAwesomeIcon icon={faCog} />}
        />
      </div>
    </Dropdown>
  ) : null;
};

export default SettingsMenu;
