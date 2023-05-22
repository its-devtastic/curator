import React from "react";
import { Outlet } from "react-router-dom";

import logo from "~/assets/strapion.png";

const Anon: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center bg-slate-50">
    <div className="flex justify-center flex-1 items-center w-full">
      <Outlet />
    </div>

    <footer className="py-6 flex items-center gap-3 w-full justify-center">
      <img src={logo} alt="Strapion" className="object-contain w-auto h-8" />
    </footer>
  </div>
);

export default Anon;
