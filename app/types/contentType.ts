export interface StrapiContentType {
  uid: string;
  apiID: string;
  kind: "singleType" | "collectionType";
  options: {
    draftAndPublish: boolean;
  };
  pluginOptions: {
    localized?: boolean;
  };
  info: {
    displayName: string;
    pluralName: string;
    singularName: string;
  };
  attributes: Record<string, Attribute>;
}

export interface Attribute {
  type: string;
  required?: boolean;
  pluginOptions?: {
    i18n?: {
      localized: boolean;
    };
  };
  components?: string[];
  [p: string]: unknown;
}

export interface StrapiComponent {
  apiID: string;
  uid: string;
  attributes: Record<string, Attribute>;
  info: {
    displayName: string;
  };
}
