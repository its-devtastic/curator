import React from "react";
import { useMatch } from "react-router-dom";
import classNames from "classnames";

const MainMenuItem: React.FC<{
  as?: React.FC<any> | string;
  label: React.ReactNode;
  isActive?: boolean;
  [p: string]: any;
}> = ({ as = "div", label, to, isActive, ...props }) => {
  const match = useMatch(to ?? "");

  return React.createElement(
    as,
    {
      ...props,
      to,
      className: classNames(
        "flex items-center select-none justify-center gap-2 py-1 px-4 rounded-full text-lg font-semibold hover:cursor-pointer no-underline text-sm whitespace-nowrap",
        isActive || (to && match)
          ? "bg-indigo-50 text-indigo-500 hover:bg-indigo-50"
          : "hover:bg-gray-100 text-gray-600"
      ),
    },
    label
  );
};

export default MainMenuItem;
