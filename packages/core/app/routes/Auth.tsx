import React from "react";
import { Outlet } from "react-router-dom";

import SecretsProvider from "~/providers/SecretsProvider";

import MainMenu from "~/ui/MainMenu";

const Auth: React.FC = () => (
  <SecretsProvider>
    <div className="flex h-screen">
      <MainMenu />
      <div className="flex-1 flex flex-col items-center overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col w-full">
          <Outlet />
        </div>
      </div>
    </div>
  </SecretsProvider>
);

export default Auth;
