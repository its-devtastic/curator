import React from "react";
import { Outlet } from "react-router-dom";

import FiltersProvider from "@/providers/FiltersProvider";
import SecretsProvider from "@/providers/SecretsProvider";
import AppHeader from "@/ui/AppHeader";
import MainMenu from "@/ui/MainMenu";

const Auth: React.FC = () => (
  <FiltersProvider>
    <SecretsProvider>
      <div className="flex h-[100dvh] overflow-hidden">
        <MainMenu />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 flex flex-col overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </SecretsProvider>
  </FiltersProvider>
);

export default Auth;
