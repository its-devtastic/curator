import { TFunction } from "i18next";

export interface FieldConfig {
  path: string;
  span?: number;
}

export interface ColumnConfig {
  path: string;
  title?: string;
  render?(value: any, record: any, opts: { t: TFunction }): React.ReactNode;
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
      edit?: { fields: FieldConfig[]; span?: number }[];
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
        columns?: ColumnConfig[];
      };
    }
  >;
  /**
   * A higher weight results in the main menu item moving more to the right.
   */
  weight?: number;
}
