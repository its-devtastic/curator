import React from "react";
import { Outlet } from "react-router-dom";

import FiltersProvider from "@/providers/FiltersProvider";
import SecretsProvider from "@/providers/SecretsProvider";
import AppHeader from "@/ui/AppHeader";
import MainMenu from "@/ui/MainMenu";

const Auth: React.FC = () => (
  <FiltersProvider>
    <SecretsProvider>
      <div className="flex h-[100dvh]">
        <MainMenu />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppHeader />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center overflow-y-auto bg-white dark:bg-gray-800">
              <div className="flex-1 flex flex-col w-full">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecretsProvider>
  </FiltersProvider>
);

export default Auth;
