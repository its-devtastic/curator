import { InjectionZone } from "@curatorjs/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@curatorjs/ui";
import * as R from "ramda";
import React from "react";
import { useTranslation } from "react-i18next";
import { PiShieldStarBold, PiSlidersBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";

import useCurator from "@/hooks/useCurator";
import useStrapi from "@/hooks/useStrapi";

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
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button size="icon" variant="ghost">
          <PiSlidersBold className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {canRead && (
            <DropdownMenuItem asChild>
              <Link to="/settings/secrets" className="space-x-2">
                <span className="inline-flex items-center justify-center size-6 rounded-full bg-amber-100">
                  <PiShieldStarBold className="size-3" />
                </span>
                <span>{t("secrets.title")}</span>
              </Link>
            </DropdownMenuItem>
          )}
          {items.map((item) => item.render()).filter(Boolean)}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
