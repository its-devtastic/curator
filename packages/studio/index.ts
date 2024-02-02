import createCuratorApp from "./app/main";

export default createCuratorApp;

// Plugins
export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as dashboardPlugin } from "./app/plugins/dashboard";
export { default as teamManagerPlugin } from "./app/plugins/team-manager";
export { default as internationalizationPlugin } from "./app/plugins/internationalization";
export { default as auditPlugin } from "./app/plugins/audit";
export { default as apiTokensPlugin } from "./app/plugins/api-tokens";
export { default as webhooksPlugin } from "./app/plugins/webhooks";

// Components
export { Item as MainMenuItem } from "./app/ui/MainMenu";

// Hooks
export { default as useSecrets } from "./app/hooks/useSecrets";
export { default as useFilters } from "./app/hooks/useFilters";

// Utils
export { parseFilterParams } from "./app/utils/filters";
