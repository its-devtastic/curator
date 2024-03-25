import type React from "react";
import type { RouteObject } from "react-router-dom";
import type { PartialDeep } from "type-fest";

import { ContentTypeConfig, FieldDefinition } from "./contentTypeConfig";
import { MediaItem } from "./media";
import { CuratorPlugin } from "./plugin";

export interface CuratorConfig {
  strapiUrl: string;
  zones: InjectionZoneEntry[];
  contentTypes: ContentTypeConfig[];
  plugins: CuratorPlugin[];
  routes: RouteObject[];
  hooks: Hook[];
  components: ComponentConfig[];
  interfaceLanguages: string[];
  about: {
    icon: string | { auth: string; header: string };
    title: string;
    website: string;
  };
  /**
   * Whether to enable the secrets service. Allows you to pass in $SECRET_VALUES
   * that will be replaced by a value stored in Strapi. Requires the
   * @curatorjs/strapi-plugin-secrets Strapi plugin.
   */
  secrets: boolean;
  /**
   * Whether to enable admin user avatars. Requires the @curatorjs/strapi-plugin-user-avatar
   * Strapi plugin.
   */
  userAvatars: boolean;
  images: {
    getImageUrl(image: MediaItem): string;
  };
}

export type UserProvidedCuratorConfig = PartialDeep<CuratorConfig> &
  Pick<CuratorConfig, "strapiUrl">;

export interface InjectionZoneEntry {
  zone: InjectionZone;
  render(): React.ReactNode;
  /**
   * Determines the order in case of multiple components.
   */
  weight: number;
}

export enum InjectionZone {
  MainMenuTop = "mainMenu::top",
  MainMenuMiddle = "mainMenu::middle",
  MainMenuBottom = "mainMenu::bottom",
  MainMenuSettings = "mainMenu::settings",
}

export interface ComponentConfig {
  apiID: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  fields?: FieldDefinition[];
  collapsible?: boolean;
  renderLabel?(
    entity: Record<string, unknown>,
    utils: { t: (s: string) => string },
  ): React.ReactNode;
}

export interface Hook {
  trigger: "view" | "save" | "create" | "login" | "logout";
  /*
   * Callback function. Not all arguments are available for all actions.
   */
  action(args: {
    apiID?: string;
    entity?: any;
    getSecret?(key: string): string;
  }): void;
}
