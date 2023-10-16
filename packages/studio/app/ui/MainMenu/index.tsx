import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { useLocation } from "react-router-dom";
import { Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { InjectionZone } from "@/types/config";
import useCurator from "@/hooks/useCurator";

import MainMenuItem from "./MainMenuItem";
import SettingsMenu from "./SettingsMenu";

const MainMenu: React.FC & {
  Item: typeof MainMenuItem;
} = () => {
  const [isOpen, setOpen] = useState(false);
  const config = useCurator();
  const location = useLocation();
  const items = R.sortBy(R.prop("weight"))(
    config.zones?.filter(
      R.where({
        zone: (zone: InjectionZone) =>
          [
            InjectionZone.MainMenuTop,
            InjectionZone.MainMenuMiddle,
            InjectionZone.MainMenuBottom,
            InjectionZone.MainMenuSettings,
          ].includes(zone),
      }),
    ) ?? [],
  );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Button
        className="md:hidden fixed top-3 left-4"
        icon={<FontAwesomeIcon icon={faBars} />}
        onClick={() => setOpen(true)}
      />
      <nav
        className={classNames(
          "bg-white dark:bg-gray-900 w-screen md:w-[240px] fixed z-10 bottom-0 top-0 left-0 md:relative transition-transform duration-300 flex flex-col border-0 border-solid border-r border-gray-200 dark:border-gray-600",
          {
            "-translate-x-full md:translate-x-0": !isOpen,
          },
        )}
      >
        <Button
          className="md:hidden absolute top-4 right-4"
          icon={<FontAwesomeIcon icon={faClose} />}
          onClick={() => setOpen(false)}
        />

        <div className="flex flex-col gap-12 p-4 flex-1 overflow-y-auto">
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
            {items.some(
              R.whereEq({ zone: InjectionZone.MainMenuSettings }),
            ) && <SettingsMenu />}
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainMenu;

export const Item = MainMenuItem;

MainMenu.Item = MainMenuItem;
