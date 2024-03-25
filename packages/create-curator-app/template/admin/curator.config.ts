import {
  apiTokensPlugin,
  contentManagerPlugin,
  dashboardPlugin,
  internationalizationPlugin,
  mediaLibraryPlugin,
  teamManagerPlugin,
  webhooksPlugin,
} from "@curatorjs/studio";
import { UserProvidedCuratorConfig } from "@curatorjs/types";

import components from "./config/components";
import contentTypes from "./config/contentTypes";

const curatorConfig: UserProvidedCuratorConfig = {
  // @ts-ignores
  strapiUrl: (import.meta as any).env.VITE_STRAPI_URL,
  about: {
    icon: "/icon.png",
    title: "ACME CMS",
    website: "acme.com",
  },
  zones: [],
  routes: [],
  contentTypes,
  components,
  hooks: [],
  interfaceLanguages: ["en"],
  secrets: true,
  plugins: [
    mediaLibraryPlugin(),
    teamManagerPlugin(),
    apiTokensPlugin(),
    webhooksPlugin(),
    dashboardPlugin({ widgets: ["recent", "drafts"] }),
    internationalizationPlugin(),
    contentManagerPlugin({
      menu: {
        groups: [
          { label: "content_groups.collections", items: ["page"] },
          { label: "content_groups.pages", items: ["homepage"] },
        ],
      },
      contentTypes: {
        page: {
          list: {},
          edit: {
            main: [{ fields: [], span: 6 }],
          },
          create: {},
        },
      },
    }),
  ],
};

export default curatorConfig;
