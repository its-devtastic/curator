import React from "react";

import DarkModeToggle from "./DarkModeToggle";
import UserMenu from "./UserMenu";

const AppHeader: React.FC = () => {
  return (
    <header className="flex-none px-4 h-14 bg-white dark:bg-gray-900 flex justify-between items-center border-0 border-solid border-b border-gray-200 dark:border-gray-600">
      <div className="flex-1" />
      <div className="flex items-center justify-between gap-4">
        <DarkModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
