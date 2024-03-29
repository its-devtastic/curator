import React from "react";
import { Link, useMatch } from "react-router-dom";
import classNames from "classnames";

const MainMenuItem: React.FC<{
  label: string;
  icon?: React.ReactNode;
  to: string;
}> = ({ label, icon, to }) => {
  const isActive = useMatch(`${to}/*`);

  return (
    <Link
      to={to}
      className={classNames(
        "flex items-center gap-2 text-sm rounded-md hover:bg-black/5 dark:hover:bg-white/5 hover:cursor-pointer no-underline px-4 py-2",
        { "bg-black/5 dark:bg-white/5": isActive },
      )}
    >
      {icon && (
        <div className="w-6 flex-none text-center text-gray-500 dark:text-gray-200 flex">
          {icon}
        </div>
      )}
      <div
        className={classNames(
          "font-semibold",
          isActive
            ? "text-gray-700 dark:text-gray-100"
            : "text-gray-500 dark:text-gray-200",
        )}
      >
        {label}
      </div>
    </Link>
  );
};

export default MainMenuItem;
