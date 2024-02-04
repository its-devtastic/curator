import { InjectionZone } from "@curatorjs/types";
import { Dropdown } from "antd";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiShieldStarBold, PiSlidersBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";

import MainMenuItem from "./MainMenuItem";

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
          () => config.secrets && canRead,
          R.append({
            key: "secrets",
            icon: (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100">
                <PiShieldStarBold className="size-4" />
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
          icon={<PiSlidersBold className="size-4" />}
        />
      </div>
    </Dropdown>
  );
};

export default SettingsMenu;
