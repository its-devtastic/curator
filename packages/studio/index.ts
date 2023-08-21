import createCuratorApp from "./app/main";

export default createCuratorApp;

// Plugins
export { default as contentManagerPlugin } from "./app/plugins/content-manager";
export { default as mediaLibraryPlugin } from "./app/plugins/media-library";
export { default as dashboardPlugin } from "./app/plugins/dashboard";
export { default as teamManagerPlugin } from "./app/plugins/team-manager";

// Types
export type {
  CuratorConfig,
  ComponentConfig,
  InjectionZoneEntry,
} from "./app/types/config";
export type { ContentTypeConfig } from "./app/types/contentTypeConfig";
export type { SessionUser } from "./app/types/session";

// Enum types
export { InjectionZone } from "./app/types/config";

// Components
export { Item as MainMenuItem } from "./app/ui/MainMenu";

// Hooks
export { default as useSecrets } from "./app/hooks/useSecrets";
