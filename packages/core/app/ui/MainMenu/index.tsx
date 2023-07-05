import React from "react";
import * as R from "ramda";

import { InjectionZone } from "~/types/config";
import useCurator from "~/hooks/useCurator";

import MainMenuItem from "./MainMenuItem";

const MainMenu: React.FC & {
  Item: typeof MainMenuItem;
} = () => {
  const config = useCurator();
  const menuItems = R.sortBy(R.prop("weight"))(
    config.zones?.filter(
      R.whereEq({
        zone: InjectionZone.MainMenu,
      })
    ) ?? []
  );

  return (
    <nav className="h-12 flex-none flex justify-center bg-gray-50 border-b border-solid border-0 border-gray-200 overflow-y-auto">
      <div className="w-full max-w-screen-xl">
        <div className="flex items-center justify-between h-full px-4 md:px-12">
          <div className="flex items-center gap-4">
            {menuItems.map(({ render }, index) => (
              <div key={index}>{render()}</div>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainMenu;

export const Item = MainMenuItem;

MainMenu.Item = MainMenuItem;
