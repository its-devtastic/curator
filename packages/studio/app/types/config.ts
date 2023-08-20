import React from "react";
import { ThemeConfig } from "antd";
import { RouteObject } from "react-router-dom";

import { ContentTypeConfig, FieldDefinition } from "./contentTypeConfig";
import { CuratorPlugin } from "./plugin";

export interface CuratorConfig {
  strapiUrl: string;
  zones?: InjectionZoneEntry[];
  contentTypes?: ContentTypeConfig[];
  plugins?: CuratorPlugin[];
  routes?: RouteObject[];
  hooks?: Hook[];
  components?: ComponentConfig[];
  interfaceLanguages?: string[];
  theme?: Partial<ThemeConfig>;
  about?: {
    icon?: string | { auth: string; header: string };
    title?: string;
    website?: string;
  };
}

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
    utils: { t: (s: string) => string }
  ): React.ReactNode;
}

export interface Hook {
  trigger: "view" | "save" | "create";
  action(
    apiID: string,
    entity: any,
    utils: { getSecret(key: string): string }
  ): void;
}
