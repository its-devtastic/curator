import React from "react";
import { useMatch } from "react-router-dom";
import classNames from "classnames";

const MainMenuItem: React.FC<{
  as?: React.FC<any> | string;
  label: React.ReactNode;
  [p: string]: any;
}> = ({ as = "div", label, to, ...props }) => {
  const match = useMatch(to ?? "");

  return React.createElement(
    as,
    {
      ...props,
      to,
      className: classNames(
        "flex items-center select-none justify-center gap-2 py-1 px-4 rounded-full text-lg text-gray-600 font-semibold hover:cursor-pointer no-underline text-sm",
        to && match
          ? "bg-indigo-500 text-white hover:bg-indigo-500"
          : "hover:bg-gray-100"
      ),
    },
    label
  );
};

export default MainMenuItem;
