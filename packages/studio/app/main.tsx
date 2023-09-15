import React, { useEffect } from "react";
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

import usePreferences from "@/hooks/usePreferences";
import CuratorProvider from "@/providers/CuratorProvider";
import StrapiProvider from "@/providers/StrapiProvider";
import { CuratorConfig } from "@/types/config";

dayjs.extend(relativeTime);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(calendar);

const Main: React.FC<{ curatorConfig: CuratorConfig }> = ({
  curatorConfig,
}) => {
  const darkMode = usePreferences((state) => state.preferences.darkMode);

  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <React.StrictMode>
      <ConfigProvider
        theme={R.mergeDeepLeft(
          {
            token: {
              colorPrimary: "#4f46e5",
              colorSuccess: "#10b981",
              colorError: "#f43f5e",
              colorWarning: "#f59e0b",
              colorTextBase: darkMode ? "#FFFFFF" : "#374151", // gray-700
              colorBgContainer: darkMode ? "#374151" : "#FFFFFF", // gray-700
              colorBgElevated: darkMode ? "#1f2937" : "#FFFFFF", // gray-800
              colorBgSpotlight: "#111827", // gray-900
              colorBorder: darkMode ? "#6b7280" : "#e5e7eb", // gray-500 / gray-200
            },
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          },
          curatorConfig.theme ?? {},
        )}
      >
        <CuratorProvider config={curatorConfig}>
          <StrapiProvider apiUrl={curatorConfig.strapiUrl}>
            <App />
          </StrapiProvider>
        </CuratorProvider>
      </ConfigProvider>
    </React.StrictMode>
  );
};

export default function createCuratorApp(curatorConfig: CuratorConfig) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Main curatorConfig={curatorConfig} />,
  );
}
