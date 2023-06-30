import createCuratorApp from "./app/main";

export default createCuratorApp;

// Plugins
export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as plausiblePlugin } from "./app/plugins/plausible";
export { default as dashboardPlugin } from "./app/plugins/dashboard";
export { default as teamManagerPlugin } from "./app/plugins/team-manager";

// Types
export type { CuratorConfig, ComponentConfig } from "./app/types/config";
export type { ContentTypeConfig } from "./app/types/contentTypeConfig";
