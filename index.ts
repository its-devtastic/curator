import createStrapionApp from "./app/main";

export default createStrapionApp;

export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as plausiblePlugin } from "./app/plugins/plausible";
export type { StrapionConfig, ComponentConfig } from "./app/types/config";
export type { ContentTypeConfig } from "./app/types/contentTypeConfig";
