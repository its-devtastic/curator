import { ColumnType } from "antd/es/table";

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
      header?: {};
    }
  >;
  // Configure the columns in the list screen. Object key should be an apiID.
  list?: Record<
    string,
    {
      columns?: ColumnType<any>[];
    }
  >;
  weight?: number;
}
