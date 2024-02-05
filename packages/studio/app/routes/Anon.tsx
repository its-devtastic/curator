import React from "react";
import { Outlet } from "react-router-dom";

import CuratorLogo from "@/components/CuratorLogo";

const Anon: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{
        backgroundImage:
          "linear-gradient(to left top, #eff6ff, #eff5ff, #eef5ff, #eef4ff, #eef3ff, #edf4ff, #edf4ff, #ecf5ff, #ebf7ff, #ebfaff, #ebfcff, #ecfeff)",
      }}
    >
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
