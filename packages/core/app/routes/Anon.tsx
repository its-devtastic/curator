import React from "react";
import { Outlet } from "react-router-dom";

import logo from "~/assets/logo.svg";

const Anon: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center bg-slate-50">
    <div className="flex flex-col justify-center flex-1 items-center w-full">
      <Outlet />
      <footer className="py-12 flex items-center gap-3 w-full justify-center">
        <img
          src={logo}
          alt="Curator"
          className="object-contain w-auto h-8 select-none"
        />
      </footer>
    </div>
  </div>
);

export default Anon;
