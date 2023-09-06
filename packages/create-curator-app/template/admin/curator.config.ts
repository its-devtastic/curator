import {
  CuratorConfig,
  dashboardPlugin,
  contentManagerPlugin,
  mediaLibraryPlugin,
  teamManagerPlugin,
  internationalizationPlugin,
} from "@curatorjs/studio";

import contentTypes from "./config/contentTypes";
import components from "./config/components";

const curatorConfig: CuratorConfig = {
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
    dashboardPlugin({ widgets: ["recentlyOpened"] }),
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
          edit: [{ fields: [], span: 6 }],
          create: {},
        },
      },
    }),
  ],
};

export default curatorConfig;
