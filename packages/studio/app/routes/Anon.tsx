import React from "react";
import { Outlet } from "react-router-dom";

import usePreferences from "@/hooks/usePreferences";
import logo from "@/assets/logo.svg";
import logoDarkMode from "@/assets/logo_dm.svg";

const Anon: React.FC = () => {
  const darkMode = usePreferences((state) => state.preferences.darkMode);

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-800">
      <div className="flex flex-col justify-center flex-1 items-center w-full">
        <Outlet />
        <footer className="py-12 flex items-center gap-3 w-full justify-center">
          <img
            src={darkMode ? logoDarkMode : logo}
            alt="Curator"
            className="object-contain w-auto h-8 select-none"
          />
        </footer>
      </div>
    </div>
  );
};

export default Anon;
