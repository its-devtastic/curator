import { InjectionZone } from "@curatorjs/types";
import { Avatar, Button, cn } from "@curatorjs/ui";
import * as R from "ramda";
import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { PiXBold } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import toColor from "string-to-color";

import useCurator from "@/hooks/useCurator";

import MainMenuItem from "./MainMenuItem";

const MainMenu: React.FC & {
  Item: typeof MainMenuItem;
} = () => {
  const [isOpen, setOpen] = useState(false);
  const config = useCurator();
  const location = useLocation();
  const icon = config.about?.icon;
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
        variant="outline"
        size="icon"
        className="md:hidden fixed top-3 left-4"
        onClick={() => setOpen(true)}
      >
        <FiMenu />
      </Button>
      <nav
        className={cn(
          "bg-background w-screen md:w-[240px] fixed z-10 bottom-0 top-0 left-0 md:relative transition-transform duration-300 flex flex-col border-r",
          {
            "-translate-x-full md:translate-x-0": !isOpen,
          },
        )}
      >
        <Button
          variant="outline"
          className="md:hidden absolute top-4 right-4"
          onClick={() => setOpen(false)}
          size="icon"
        >
          <PiXBold />
        </Button>

        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center px-4 h-14 border-b">
            <Link
              to="/"
              className="flex select-none no-underline items-center gap-3"
            >
              {icon ? (
                <img
                  src={typeof icon === "string" ? icon : icon.header}
                  alt=""
                  className="flex-none size-8 object-contain"
                />
              ) : (
                <Avatar
                  style={{
                    backgroundColor: toColor(config.about?.title ?? ""),
                  }}
                  className="flex-none size-8"
                >
                  {config.about?.title?.[0] || "C"}
                </Avatar>
              )}
              <div className="mt-1">
                <div className="text-sm font-semibold">
                  {config.about?.title || "Curator"}
                </div>
                {config.about.website && (
                  <a
                    href={config.about.website}
                    target="_blank"
                    rel="noreferrer nofollow noopener"
                    className="text-muted-foreground text-xs truncate no-underline hover:underline inline-block"
                  >
                    {config.about.website
                      .replace(/http?s:\/\//, "")
                      .replace("www.", "")}
                  </a>
                )}
              </div>
            </Link>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="space-y-1 border-b p-4">
              {items
                .filter(R.whereEq({ zone: InjectionZone.MainMenuTop }))
                .map(({ render }, index) => (
                  <div key={index}>{render()}</div>
                ))}
            </div>

            <div className="space-y-1 flex-1 p-4 border-b">
              {items
                .filter(R.whereEq({ zone: InjectionZone.MainMenuMiddle }))
                .map(({ render }, index) => (
                  <div key={index}>{render()}</div>
                ))}
            </div>

            <div className="space-y-1 p-4">
              {items
                .filter(R.whereEq({ zone: InjectionZone.MainMenuBottom }))
                .map(({ render }, index) => (
                  <div key={index}>{render()}</div>
                ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MainMenu;

export const Item = MainMenuItem;

MainMenu.Item = MainMenuItem;
