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
      description: "The Strapi Framework",
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
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span>Created by</span>
          <a href="https://www.devtastic.io" target="_blank">
            <img
              src="/devtastic_logo.webp"
              alt=""
              style={{ width: 200, height: "auto" }}
            />
          </a>
        </div>
      </div>
    ),
  },
};

export default config;
