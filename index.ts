import createStrapionApp from "./app/main";

export default createStrapionApp;

// Plugins
export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as plausiblePlugin } from "./app/plugins/plausible";
export { default as dashboardPlugin } from "./app/plugins/dashboard";

// Types
export type { StrapionConfig, ComponentConfig } from "./app/types/config";
export type { ContentTypeConfig } from "./app/types/contentTypeConfig";
