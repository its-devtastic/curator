import React from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";

import { InjectionZone } from "~/types/config";
import useStrapion from "~/hooks/useStrapion";

import MainMenuItem from "./MainMenuItem";

const MainMenu: React.FC & {
  Item: typeof MainMenuItem;
} = () => {
  const config = useStrapion();
  const menuItems = R.sortBy(R.prop("weight"))(
    config.zones.filter(
      R.where({
        zone: (zone: InjectionZone) =>
          [InjectionZone.MainMenuTop, InjectionZone.MainMenuBottom].includes(
            zone
          ),
      })
    )
  );

  return (
    <nav className="py-6 w-16 flex-none flex flex-col items-center justify-between bg-gray-50 border-r border-solid border-0 border-gray-200">
      <div className="space-y-6">
        {menuItems
          .filter(R.whereEq({ zone: InjectionZone.MainMenuTop }))
          .map(({ render }, index) => (
            <div key={index}>{render()}</div>
          ))}
      </div>
      <div className="space-y-6">
        {menuItems
          .filter(R.whereEq({ zone: InjectionZone.MainMenuBottom }))
          .map(({ render }, index) => (
            <div key={index}>{render()}</div>
          ))}
      </div>
    </nav>
  );
};

export default MainMenu;

MainMenu.Item = MainMenuItem;
