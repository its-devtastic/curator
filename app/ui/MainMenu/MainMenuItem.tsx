import React from "react";
import { useMatch } from "react-router-dom";
import classNames from "classnames";

const MainMenuItem: React.FC<{
  as?: React.FC<any> | string;
  children: React.ReactNode;
  [p: string]: any;
}> = ({ as = "div", children, to, ...props }) => {
  const match = useMatch(to ?? "");

  return React.createElement(
    as,
    {
      ...props,
      to,
      className: classNames(
        "flex items-center justify-center gap-2 h-10 w-10 rounded-lg text-lg text-gray-600 font-semibold hover:bg-gray-100 hover:cursor-pointer",
        { "bg-indigo-100": to && match }
      ),
    },
    children
  );
};

export default MainMenuItem;
