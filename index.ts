import createStrapionApp from "./app/main";

export default createStrapionApp;

export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as plausiblePlugin } from "./app/plugins/plausible";
export { default as triggerPlugin } from "./app/plugins/trigger";
export type { StrapionConfig } from "./app/types/config";
