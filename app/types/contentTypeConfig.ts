import type React from "react";
import type { ColumnType } from "antd/es/table";
import { TFunction } from "i18next";

export interface ContentTypeConfig {
  apiID: string;
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  buildUrl?(entity: any): string;
  columns?: ColumnType<any>[];
  fields?: {
    main?: FieldDefinition[];
    side?: FieldDefinition[];
  };
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
