import React from "react";
import ReactDOM from "react-dom/client";
import dayjs from "dayjs";
import { ConfigProvider } from "antd";

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
      <ConfigProvider theme={strapionConfig.theme}>
        <StrapionProvider config={strapionConfig}>
          <StrapiProvider apiUrl={strapionConfig.strapiUrl}>
            <App />
          </StrapiProvider>
        </StrapionProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
}
