import React from "react";
import { Link } from "react-router-dom";
import toColor from "string-to-color";
import { Avatar } from "antd";

import useCurator from "@/hooks/useCurator";

import UserMenu from "./UserMenu";
import DarkModeToggle from "./DarkModeToggle";

const AppHeader: React.FC = () => {
  const config = useCurator();
  const icon = config.about?.icon;

  return (
    <header className="px-4 py-2 bg-white dark:bg-gray-900 flex justify-between items-center border-0 border-solid border-b border-gray-200 dark:border-gray-600">
      <div className="md:hidden" />
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="flex select-none no-underline items-center gap-2"
        >
          {icon ? (
            <img
              src={typeof icon === "string" ? icon : icon.header}
              alt=""
              className="flex-none w-8 h-8 object-contain"
            />
          ) : (
            <Avatar
              shape="square"
              style={{
                backgroundColor: toColor(config.about?.title ?? ""),
              }}
              alt=""
              className="flex-none w-8 h-8"
            >
              {config.about?.title?.[0] || "C"}
            </Avatar>
          )}
          <div className="mt-1">
            <div className="text-gray-800 dark:text-gray-50 text-sm font-semibold">
              {config.about?.title || "Curator"}
            </div>
            {config.about.website && (
              <a
                href={config.about.website}
                target="_blank"
                rel="noreferrer nofollow noopener"
                className="text-gray-500 dark:text-gray-300 text-xs truncate no-underline hover:underline inline-block"
              >
                {config.about.website
                  .replace(/http?s:\/\//, "")
                  .replace("www.", "")}
              </a>
            )}
          </div>
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4">
        <DarkModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
