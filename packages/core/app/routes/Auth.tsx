import React from "react";
import { Outlet } from "react-router-dom";

import SecretsProvider from "~/providers/SecretsProvider";

import MainMenu from "~/ui/MainMenu";
import AppHeader from "~/ui/AppHeader";

import logo from "~/assets/curator.png";
import pkg from "../../package.json";

const Auth: React.FC = () => (
  <SecretsProvider>
    <div className="flex flex-col h-screen">
      <AppHeader />
      <MainMenu />
      <div className="flex-1 flex flex-col items-center overflow-y-auto bg-white">
        <div className="flex-1 flex flex-col items-center w-full max-w-screen-xl">
          <div className="flex-1 flex flex-col w-full">
            <Outlet />
          </div>
        </div>
      </div>
      <footer className="w-full border-t border-solid border-0 border-gray-200">
        <div className="py-1 px-4 md:px-12 max-w-screen-xl mx-auto flex items-center justify-center md:justify-end gap-6">
          <img src={logo} alt="Curator" className="object-contain w-auto h-6" />
          <div className="text-xs font-semibold text-gray-400 select-none">{`version ${pkg.version}`}</div>
          <ul className="list-none space-x-2 text-xs font-semibold p-0">
            <li>
              <a
                className="link"
                href="https://its-devtastic.github.io/curator-docs"
                target="_blank"
                rel="noreferrer noopener nofollow"
              >
                Docs
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  </SecretsProvider>
);

export default Auth;