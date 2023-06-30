import {
  CuratorConfig,
  dashboardPlugin,
  contentManagerPlugin,
  mediaLibraryPlugin,
  teamManagerPlugin,
} from "@curatorjs/core";

import contentTypes from "./config/contentTypes";
import components from "./config/components";

const curatorConfig: CuratorConfig = {
  // @ts-ignores
  strapiUrl: (import.meta as any).env.VITE_STRAPI_URL,
  icon: "/icon.png",
  title: "My Curator CMS",
  zones: [],
  routes: [],
  contentTypes,
  components,
  hooks: [],
  interfaceLanguages: ["en"],
  plugins: [
    mediaLibraryPlugin(),
    teamManagerPlugin(),
    dashboardPlugin({
      recentlyOpened: {
        renderTitle(item: any) {
          switch (item.apiID) {
            case "page":
              return item.title;
          }
        },
      },
    }),
    contentManagerPlugin({
      menu: {
        groups: [
          { label: "content_groups.collections", items: ["page"] },
          { label: "content_groups.pages", items: ["homepage"] },
        ],
      },
      list: {},
      edit: {},
    }),
  ],
};

export default curatorConfig;
