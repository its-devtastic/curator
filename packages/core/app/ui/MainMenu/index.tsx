import React from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";
import toColor from "string-to-color";
import { Avatar } from "antd";

import { InjectionZone } from "~/types/config";
import useCurator from "~/hooks/useCurator";

import UserMenu from "./UserMenu";
import MainMenuItem from "./MainMenuItem";

const MainMenu: React.FC & {
  Item: typeof MainMenuItem;
} = () => {
  const config = useCurator();
  const icon = config.about?.icon;
  const items = R.sortBy(R.prop("weight"))(
    config.zones?.filter(
      R.where({
        zone: (zone: InjectionZone) =>
          [
            InjectionZone.MainMenuTop,
            InjectionZone.MainMenuMiddle,
            InjectionZone.MainMenuBottom,
          ].includes(zone),
      })
    ) ?? []
  );

  return (
    <nav className="bg-gray-50 flex flex-col gap-12 p-4 w-[220px]">
      <Link
        to="/"
        className="flex select-none no-underline items-center gap-3 px-4"
      >
        {icon ? (
          <Avatar
            shape="square"
            size="large"
            src={typeof icon === "string" ? icon : icon.header}
            alt=""
          />
        ) : (
          <Avatar
            shape="square"
            size="large"
            style={{ backgroundColor: toColor(config.about?.title ?? "") }}
            alt=""
          >
            {config.about?.title?.[0] || "C"}
          </Avatar>
        )}
        <div>
          <div className="text-gray-800 text-sm font-semibold">
            {config.about?.title || "Curator"}
          </div>
          <div className="text-gray-500 text-xs">{config.about?.website}</div>
        </div>
      </Link>

      <div className="space-y-1">
        {items
          .filter(R.whereEq({ zone: InjectionZone.MainMenuTop }))
          .map(({ render }, index) => (
            <div key={index}>{render()}</div>
          ))}
      </div>

      <div className="space-y-1 flex-1">
        {items
          .filter(R.whereEq({ zone: InjectionZone.MainMenuMiddle }))
          .map(({ render }, index) => (
            <div key={index}>{render()}</div>
          ))}
      </div>

      <div className="space-y-1">
        {items
          .filter(R.whereEq({ zone: InjectionZone.MainMenuBottom }))
          .map(({ render }, index) => (
            <div key={index}>{render()}</div>
          ))}
        <UserMenu />
      </div>
    </nav>
  );
};

export default MainMenu;

export const Item = MainMenuItem;

MainMenu.Item = MainMenuItem;
