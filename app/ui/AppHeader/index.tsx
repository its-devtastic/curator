import React from "react";
import * as R from "ramda";
import { Link } from "react-router-dom";

import { InjectionZone } from "~/types/config";
import useStrapion from "~/hooks/useStrapion";

import AppHeaderItem from "./AppHeaderItem";
import UserMenu from "./UserMenu";

const AppHeader: React.FC & {
  Item: typeof AppHeaderItem;
} = () => {
  const config = useStrapion();
  const icon = config.icon;
  const items = R.sortBy(R.prop("weight"))(
    config.zones.filter(
      R.where({
        zone: (zone: InjectionZone) =>
          [
            InjectionZone.AppHeaderLeft,
            InjectionZone.AppHeaderCenter,
            InjectionZone.AppHeaderRight,
          ].includes(zone),
      })
    )
  );

  return (
    <header className="flex-none h-12 px-12 bg-indigo-600 z-10 flex justify-center border-b border-0 border-solid border-indigo-900">
      <div className="w-full max-w-screen-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex select-none no-underline items-center gap-3"
          >
            {icon && <img className="h-8 w-8 object-cover" src={icon} alt="" />}
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
          <div>
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

AppHeader.Item = AppHeaderItem;
