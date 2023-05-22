import React from "react";
import { ThemeConfig } from "antd";
import { RouteObject } from "react-router-dom";

import { ContentTypeConfig, FieldDefinition } from "./contentTypeConfig";
import { StrapionPlugin } from "./plugin";

export interface StrapionConfig {
  strapiUrl: string;
  zones: InjectionZoneEntry[];
  contentTypes: ContentTypeConfig[];
  components?: ComponentConfig[];
  plugins: StrapionPlugin[];
  routes: RouteObject[];
  hooks: Hook[];
  interfaceLanguages?: string[];
  theme?: Partial<ThemeConfig>;
  icon?: string;
  title?: string;
}

export interface InjectionZoneEntry {
  zone: InjectionZone;
  // Determines the order in case of multiple components.
  weight: number;
  render(): React.ReactNode;
}

export enum InjectionZone {
  MainMenuTop = "mainMenu::top",
  MainMenuBottom = "mainMenu::bottom",
  AppHeaderLeft = "appHeadeer::left",
  AppHeaderRight = "appHeadeer::center",
  AppHeaderCenter = "appHeadeer::right",
}

export interface ComponentConfig {
  apiID: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  labelField?: string;
  fields?: FieldDefinition[];
}

export interface Hook {
  trigger: "view" | "save";
  action(
    apiID: string,
    entity: any,
    utils: { getSecret(key: string): string }
  ): void;
}
