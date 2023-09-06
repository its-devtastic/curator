import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

import logo from "./public/logo.svg";

const config: DocsThemeConfig = {
  logo: <img src={logo.src} alt="" style={{ height: 32, width: "auto" }} />,
  project: {
    link: "https://github.com/its-devtastic/curator",
  },
  docsRepositoryBase: "https://github.com/its-devtastic/curator/tree/main/docs",
  useNextSeoProps() {
    return {
      title: "Curator",
      description: "Modern full-stack CMS built on Strapi and Next.js",
    };
  },
  head: () => (
    <>
      <link rel="icon" type="image/png" href="/favicon.png" />
    </>
  ),
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
          <a href="https://github.com/its-devtastic/curator" target="_blank">
            Curator
          </a>
          .
        </div>
        <div>
          Created by{" "}
          <a href="https://www.devtastic.build" target="_blank">
            Devtastic
          </a>
        </div>
      </div>
    ),
  },
};

export default config;
