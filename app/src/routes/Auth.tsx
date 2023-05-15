import React from "react";
import { Outlet } from "react-router-dom";

import SecretsProvider from "~/providers/SecretsProvider";

import MainMenu from "~/ui/MainMenu";
import AppHeader from "~/ui/AppHeader";

const Auth: React.FC = () => (
  <SecretsProvider>
    <div className="flex flex-col h-screen">
      <AppHeader />
      <div className="flex-1 flex overflow-hidden">
        <MainMenu />
        <div className="flex-1 overflow-y-auto flex flex-col bg-gray-50">
          <Outlet />
        </div>
      </div>
    </div>
  </SecretsProvider>
);

export default Auth;
