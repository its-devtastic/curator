import React from "react";

import DarkModeToggle from "./DarkModeToggle";
import SettingsMenu from "./SettingsMenu";
import UserMenu from "./UserMenu";

const AppHeader: React.FC = () => {
  return (
    <header className="flex-none px-4 lg:px-12 h-14 bg-background flex justify-between items-center border-b">
      <div className="flex-1" />
      <div className="flex items-center justify-between gap-2">
        <SettingsMenu />
        <DarkModeToggle />
        <UserMenu />
      </div>
    </header>
  );
};

export default AppHeader;
