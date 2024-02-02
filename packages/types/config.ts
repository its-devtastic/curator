import type React from "react";
import type { ThemeConfig } from "antd";
import type { RouteObject } from "react-router-dom";
import type { PartialDeep } from "type-fest";

import { ContentTypeConfig, FieldDefinition } from "./contentTypeConfig";
import { CuratorPlugin } from "./plugin";
import { MediaItem } from "./media";

export interface CuratorConfig {
  strapiUrl: string;
  zones: InjectionZoneEntry[];
  contentTypes: ContentTypeConfig[];
  plugins: CuratorPlugin[];
  routes: RouteObject[];
  hooks: Hook[];
  components: ComponentConfig[];
  interfaceLanguages: string[];
  theme: Partial<ThemeConfig>;
  about: {
    icon: string | { auth: string; header: string };
    title: string;
    website: string;
  };
  secrets: boolean;
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
