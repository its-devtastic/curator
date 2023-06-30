import type React from "react";
import { TFunction } from "i18next";

import { Entity } from "./content";

export interface ContentTypeConfig {
  apiID: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  fields: FieldDefinition[];
  getEntityUrl?(entity: Entity): string;
}

export interface FieldDefinition {
  path: string;
  label?: string;
  description?: string;
  hint?: string;
  input?: string;
  inputProps?: Record<string, any>;
  /** Config for relation and enum fields */
  renderItem?(item: any, utils: { t: TFunction }): React.ReactNode;
}
