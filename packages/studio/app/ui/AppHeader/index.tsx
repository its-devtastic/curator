import React from "react";

import DarkModeToggle from "./DarkModeToggle";
import UserMenu from "./UserMenu";

const AppHeader: React.FC = () => {
  return (
    <header className="flex-none px-4 h-14 bg-background flex justify-between items-center border-b">
      <div className="flex-1" />
      <div className="flex items-center justify-between gap-4">
        <DarkModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
