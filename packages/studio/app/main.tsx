import "flag-icons/css/flag-icons.min.css";
import "@fontsource-variable/inter";
import "dayjs/locale/nl";
import "./index.css";

import { CuratorConfig } from "@curatorjs/types";
import { TooltipProvider } from "@curatorjs/ui";
import { ConfigProvider, theme } from "antd";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
// Day.js plugins
import relativeTime from "dayjs/plugin/relativeTime";
import * as R from "ramda";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";

import usePreferences from "@/hooks/usePreferences";
import CuratorProvider from "@/providers/CuratorProvider";
import StrapiProvider from "@/providers/StrapiProvider";

import App from "./App";

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
              colorTextBase: darkMode ? "#FFFFFF" : "#3f3f46", // gray-700
              colorBgContainer: darkMode ? "#3f3f46" : "#FFFFFF", // gray-700
              colorBgElevated: darkMode ? "#27272a" : "#FFFFFF", // gray-800
              colorBgSpotlight: "#18181b", // gray-900
              colorBorder: darkMode ? "#71717a" : "#e4e4e7", // gray-500 / gray-200
              controlHeight: 36,
            },
            algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          },
          curatorConfig.theme ?? {},
        )}
      >
        <CuratorProvider config={curatorConfig}>
          <StrapiProvider apiUrl={curatorConfig.strapiUrl}>
            <TooltipProvider>
              <App />
            </TooltipProvider>
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
