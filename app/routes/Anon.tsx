import React from "react";
import { Outlet } from "react-router-dom";

import logo from "../assets/strapion.png";

const Anon: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center bg-slate-50">
    <div className="flex justify-center flex-1 items-center w-full">
      <Outlet />
    </div>

    <footer className="py-6 flex items-center gap-3 w-full justify-center">
      <img src={logo} alt="" className="object-contain w-8 h-8" />
      <span className="text-sm font-semibold select-none text-slate-400">
        Strapion
      </span>
    </footer>
  </div>
);

export default Anon;
