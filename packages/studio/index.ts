import createCuratorApp from "./app/main";

export default createCuratorApp;

// Plugins
export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as dashboardPlugin } from "./app/plugins/dashboard";
export { default as internationalizationPlugin } from "./app/plugins/internationalization";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as teamManagerPlugin } from "./app/plugins/team-manager";

// Components
export { Item as MainMenuItem } from "./app/ui/MainMenu";

// Hooks
export { default as useFilters } from "./app/hooks/useFilters";
export { default as useSecrets } from "./app/hooks/useSecrets";

// Utils
export { parseFilterParams } from "./app/utils/filters";
