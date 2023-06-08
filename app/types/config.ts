import React from "react";
import { ThemeConfig } from "antd";
import { RouteObject } from "react-router-dom";

import { ContentTypeConfig, FieldDefinition } from "./contentTypeConfig";
import { StrapionPlugin } from "./plugin";
import { Entity } from "./content";

export interface StrapionConfig {
  strapiUrl: string;
  zones?: InjectionZoneEntry[];
  contentTypes?: ContentTypeConfig[];
  plugins?: StrapionPlugin[];
  routes?: RouteObject[];
  hooks?: Hook[];
  components?: ComponentConfig[];
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
  MainMenu = "mainMenu::left",
  AppHeaderLeft = "appHeader::left",
  AppHeaderRight = "appHeader::center",
  AppHeaderCenter = "appHeader::right",
}

export interface ComponentConfig {
  apiID: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  fields?: FieldDefinition[];
  renderLabel?(entity: Record<string, unknown>): React.ReactNode;
}

export interface Hook {
  trigger: "view" | "save";
  action(
    apiID: string,
    entity: any,
    utils: { getSecret(key: string): string }
  ): void;
}
