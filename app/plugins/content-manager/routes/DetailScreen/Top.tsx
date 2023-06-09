import React from "react";

import LanguageSwitcher from "./LanguageSwitcher";

const Top: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
      <div />
      <LanguageSwitcher />
    </div>
  );
};

export default Top;
