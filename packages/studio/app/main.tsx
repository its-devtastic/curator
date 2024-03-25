import "flag-icons/css/flag-icons.min.css";
import "@fontsource-variable/inter";
import "dayjs/locale/nl";
import "./index.css";

import { UserProvidedCuratorConfig } from "@curatorjs/types";
import { Toaster, TooltipProvider } from "@curatorjs/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import calendar from "dayjs/plugin/calendar";
import localeData from "dayjs/plugin/localeData";
import localizedFormat from "dayjs/plugin/localizedFormat";
// Day.js plugins
import relativeTime from "dayjs/plugin/relativeTime";
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

const queryClient = new QueryClient();

const Main: React.FC<{ curatorConfig: UserProvidedCuratorConfig }> = ({
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
      <QueryClientProvider client={queryClient}>
        <CuratorProvider config={curatorConfig}>
          <StrapiProvider apiUrl={curatorConfig.strapiUrl}>
            <TooltipProvider>
              <App />
              <Toaster />
            </TooltipProvider>
          </StrapiProvider>
        </CuratorProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default function createCuratorApp(
  curatorConfig: UserProvidedCuratorConfig,
) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Main curatorConfig={curatorConfig} />,
  );
}
