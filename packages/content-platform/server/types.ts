export interface PluginConfig {
  audit:
    | boolean
    | {
        include?: string[];
        exclude?: string;
      };
  versioning:
    | boolean
    | {
        throttle?: number;
      };
}

export interface ContentTypePluginOptions {
  versioning?: boolean;
}
