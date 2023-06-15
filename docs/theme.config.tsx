import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import logo from "./public/strapion.png";

const config: DocsThemeConfig = {
  logo: <img src={logo.src} alt="" style={{ height: 32, width: "auto" }} />,
  project: {
    link: "https://github.com/its-devtastic/strapion",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/its-devtastic/strapion-docs",
  footer: {
    text: (
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          MIT {new Date().getFullYear()} ©{" "}
          <a href="https://github.com/its-devtastic/strapion" target="_blank">
            Strapion
          </a>
          .
        </div>
        <div>
          Build in Utrecht by{" "}
          <a href="https://www.devtastic.build" target="_blank">
            Devtastic
          </a>
        </div>
      </div>
    ),
  },
};

export default config;
