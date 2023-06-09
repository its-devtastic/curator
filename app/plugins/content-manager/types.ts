import { ColumnType } from "antd/es/table";

import { Entity } from "~/types/content";

export interface FieldConfig {
  path: string;
}

export interface PluginOptions {
  // Configure the content manager menu.
  menu?: { groups?: { label: string; items: string[] }[] };
  // Configure the fields in the edit screen. Object key should be an apiID.
  edit?: Record<
    string,
    {
      main?: FieldConfig[];
      side?: FieldConfig[];
      header?: {
        getEntityUrl?(entity: Entity): string;
      };
    }
  >;
  // Configure the columns in the list screen. Object key should be an apiID.
  list?: Record<
    string,
    {
      columns?: ColumnType<any>[];
    }
  >;
}
