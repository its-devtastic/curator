import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "antd";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faShieldHalved } from "@fortawesome/free-solid-svg-icons";

import { InjectionZone } from "@curatorjs/types";
import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";

import MainMenuItem from "./MainMenuItem";
import { useNavigate } from "react-router-dom";

const SettingsMenu: React.FC = () => {
  const { t } = useTranslation();
  const config = useCurator();
  const navigate = useNavigate();
  const { permissions } = useStrapi();
  const items = R.sortBy(R.prop("weight"))(
    config.zones?.filter(
      R.whereEq({
        zone: InjectionZone.MainMenuSettings,
      }),
    ) ?? [],
  );
  const canRead = permissions.some(
    R.whereEq({
      action: "plugin::content-manager.explorer.read",
      subject: "plugin::curator.curator-secret",
    }),
  );

  return (
    <Dropdown
      trigger={["click"]}
      placement="topRight"
      menu={{
        items: R.when(
          () => !!config.secrets && canRead,
          R.append({
            key: "secrets",
            icon: (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100">
                <FontAwesomeIcon
                  className="text-amber-500"
                  icon={faShieldHalved}
                />
              </span>
            ),
            label: t("secrets.title"),
            onClick() {
              navigate("/settings/secrets");
            },
          }),
        )(
          items.map(
            (item, index) =>
              ({
                key: String(index),
                label: item.render(),
              }) as any,
          ),
        ),
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
  );
};

export default SettingsMenu;
