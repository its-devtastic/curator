import React, { useEffect, useState } from "react";
import * as R from "ramda";
import { Link, useLocation } from "react-router-dom";
import toColor from "string-to-color";
import { Avatar, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";

import { InjectionZone } from "@/types/config";
import useCurator from "@/hooks/useCurator";

import UserMenu from "./UserMenu";
import MainMenuItem from "./MainMenuItem";
import DarkModeToggle from "./DarkModeToggle";
import SettingsMenu from "./SettingsMenu";

const MainMenu: React.FC & {
  Item: typeof MainMenuItem;
} = () => {
  const [isOpen, setOpen] = useState(false);
  const config = useCurator();
  const icon = config.about?.icon;
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
      })
    ) ?? []
  );

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <Button
        className="md:hidden fixed top-4 left-4"
        icon={<FontAwesomeIcon icon={faBars} />}
        onClick={() => setOpen(true)}
      />
      <nav
        className={classNames(
          "bg-gray-50 dark:bg-gray-900 w-screen md:w-[240px] fixed z-10 bottom-0 top-0 left-0 md:relative transition-transform duration-300 flex flex-col overflow-y-auto",
          {
            "-translate-x-full md:translate-x-0": !isOpen,
          }
        )}
      >
        <Button
          className="md:hidden absolute top-4 right-4"
          icon={<FontAwesomeIcon icon={faClose} />}
          onClick={() => setOpen(false)}
        />
        <div className="flex flex-col gap-12 p-4 flex-1">
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
              <div className="text-gray-800 dark:text-gray-50 text-sm font-semibold">
                {config.about?.title || "Curator"}
              </div>
              <div className="text-gray-500 dark:text-gray-300 text-xs">
                {config.about?.website}
              </div>
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
            {items.some(
              R.whereEq({ zone: InjectionZone.MainMenuSettings })
            ) && <SettingsMenu />}
            <UserMenu />
          </div>
        </div>
        <div className="border-0 border-t border-solid border-gray-200 dark:border-gray-600 px-6 py-2">
          <DarkModeToggle />
        </div>
      </nav>
    </>
  );
};

export default MainMenu;

export const Item = MainMenuItem;

MainMenu.Item = MainMenuItem;
