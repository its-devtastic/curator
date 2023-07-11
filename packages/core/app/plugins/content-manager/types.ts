import { ColumnType } from "antd/es/table";

export interface FieldConfig {
  path: string;
}

export interface PluginOptions {
  /**
   * Configure the content manager menu. Contrary to the Strapi admin, items do
   * not automatically show up in the menu.
   */
  menu?: { groups?: { label: string; items: string[] }[] };
  /**
   * Object key should be an apiID.
   */
  contentTypes?: Record<
    string,
    {
      /**
       * Configure the fields in the edit screen.
       */
      edit?: {
        main?: FieldConfig[];
        side?: FieldConfig[];
        header?: {};
      };
      /**
       * Configure the fields in the create dialog.
       * If omitted, content will be created through the edit screen.
       */
      create?: {
        /**
         * You can use the create dialog for all content creation or only for
         * creating related items.
         */
        when?: "always" | "relation";
        main?: FieldConfig[];
      };
      /**
       * Configure the columns in the list screen.
       */
      list?: {
        columns?: ColumnType<any>[];
      };
    }
  >;
  /**
   * A higher weight results in the main menu item moving more to the right.
   */
  weight?: number;
}
