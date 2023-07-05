import React from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";

import { InjectionZone } from "~/types/config";
import useCurator from "~/hooks/useCurator";

import AppHeaderItem from "./AppHeaderItem";
import UserMenu from "./UserMenu";
import HelpMenu from "./HelpMenu";

const AppHeader: React.FC & {
  Item: typeof AppHeaderItem;
} = () => {
  const config = useCurator();
  const icon = config.icon;
  const items = R.sortBy(R.prop("weight"))(
    config.zones?.filter(
      R.where({
        zone: (zone: InjectionZone) =>
          [
            InjectionZone.AppHeaderLeft,
            InjectionZone.AppHeaderCenter,
            InjectionZone.AppHeaderRight,
          ].includes(zone),
      })
    ) ?? []
  );

  return (
    <header className="flex-none h-12 bg-indigo-600 z-10 flex justify-center border-b border-0 border-solid border-indigo-800 shadow-[0_2px] shadow-gray-800/5">
      <div className="w-full max-w-screen-xl">
        <div className="flex items-center justify-between px-4 md:px-12 h-full">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex select-none no-underline items-center gap-3"
            >
              {icon && (
                <img
                  className="h-8 w-8 object-cover"
                  src={typeof icon === "string" ? icon : icon.header}
                  alt=""
                />
              )}
              <span className="text-white font-semibold text-sm">
                {config.title}
              </span>
            </Link>
            {items
              .filter(R.whereEq({ zone: InjectionZone.AppHeaderLeft }))
              .map(({ render }, index) => (
                <div key={index}>{render()}</div>
              ))}
          </div>
          <div className="flex items-center gap-3">
            {items
              .filter(R.whereEq({ zone: InjectionZone.AppHeaderCenter }))
              .map(({ render }, index) => (
                <div key={index}>{render()}</div>
              ))}
          </div>
          <div className="flex items-center gap-3">
            {items
              .filter(R.whereEq({ zone: InjectionZone.AppHeaderRight }))
              .map(({ render }, index) => (
                <div key={index}>{render()}</div>
              ))}
            <HelpMenu />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

AppHeader.Item = AppHeaderItem;
