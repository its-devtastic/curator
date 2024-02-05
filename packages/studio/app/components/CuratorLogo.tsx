import React from "react";

import logo from "@/assets/logo.svg";
import logoDarkMode from "@/assets/logo_dm.svg";
import usePreferences from "@/hooks/usePreferences";

export default function CuratorLogo() {
  const darkMode = usePreferences((state) => state.preferences.darkMode);

  return (
    <img
      src={darkMode ? logoDarkMode : logo}
      alt="Curator"
      className="object-contain w-auto h-5 select-none"
      draggable={false}
    />
  );
}
