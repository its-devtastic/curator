import React from "react";
import { Outlet } from "react-router-dom";

import SecretsProvider from "@/providers/SecretsProvider";
import FiltersProvider from "@/providers/FiltersProvider";

import MainMenu from "@/ui/MainMenu";

const Auth: React.FC = () => (
  <FiltersProvider>
    <SecretsProvider>
      <div className="flex h-screen">
        <MainMenu />
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex flex-col items-center overflow-y-auto bg-white dark:bg-gray-800">
            <div className="flex-1 flex flex-col w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </SecretsProvider>
  </FiltersProvider>
);

export default Auth;
