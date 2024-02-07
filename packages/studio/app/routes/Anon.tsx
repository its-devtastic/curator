import React from "react";
import { Outlet } from "react-router-dom";

import CuratorLogo from "@/components/CuratorLogo";

const Anon: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="flex flex-col justify-center flex-1 items-center w-full">
        <Outlet />
        <footer className="py-12 flex items-center gap-3 w-full justify-center">
          <CuratorLogo />
        </footer>
      </div>
    </div>
  );
};

export default Anon;
