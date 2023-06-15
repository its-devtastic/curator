import React from "react";
import ReactDOM from "react-dom/client";
import dayjs from "dayjs";
import { ConfigProvider, theme } from "antd";
import * as R from "ramda";

import "flag-icons/css/flag-icons.min.css";

// Day.js plugins
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/nl";

import App from "./App";
import "./index.css";

import StrapionProvider from "./providers/StrapionProvider";
import StrapiProvider from "./providers/StrapiProvider";
import { StrapionConfig } from "./types/config";

dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

export default function createStrapionApp(strapionConfig: StrapionConfig) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <ConfigProvider
        theme={R.mergeDeepLeft(
          {
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: "#4f46e5",
              colorSuccess: "#10b981",
              colorError: "#f43f5e",
              colorWarning: "#f59e0b",
              colorTextBase: "#030712",
              motion: false,
            },
          },
          strapionConfig.theme ?? {}
        )}
      >
        <StrapionProvider config={strapionConfig}>
          <StrapiProvider apiUrl={strapionConfig.strapiUrl}>
            <App />
          </StrapiProvider>
        </StrapionProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
