import classNames from "classnames";
import React from "react";
import { Link, useMatch } from "react-router-dom";

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
        "flex items-center gap-2 text-sm rounded-md font-medium hover:cursor-pointer no-underline px-4 py-2",
        isActive
          ? "bg-primary-800 dark:bg-white/5"
          : "hover:bg-gray-100 dark:hover:bg-white/5",
      )}
    >
      {icon && (
        <div
          className={classNames(
            "w-6 flex-none text-center dark:text-gray-200 flex",
            isActive ? "text-primary-50" : "text-gray-800",
          )}
        >
          {icon}
        </div>
      )}
      <div
        className={classNames(
          isActive
            ? "text-primary-50 dark:text-gray-100"
            : "text-gray-800 dark:text-gray-200",
        )}
      >
        {label}
      </div>
    </Link>
  );
};

export default MainMenuItem;
