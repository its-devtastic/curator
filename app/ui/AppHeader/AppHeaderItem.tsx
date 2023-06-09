import React from "react";

const AppHeaderItem: React.FC<{
  as?: React.FC<any> | string;
  children: React.ReactNode;
  [p: string]: any;
}> = ({ as = "div", children, ...props }) =>
  React.createElement(
    as,
    {
      ...props,
      className:
        "flex items-center justify-center gap-2 h-10 w-10 rounded-lg text-white font-semibold hover:bg-indigo-700 hover:cursor-pointer",
    },
    children
  );

export default AppHeaderItem;
