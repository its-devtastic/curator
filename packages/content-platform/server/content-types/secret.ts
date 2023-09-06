export default {
  kind: "collectionType",
  collectionName: "curator_secret",
  info: {
    singularName: "curator-secret",
    pluralName: "curator-secrets",
    displayName: "Curator Secret",
    description: "A key-value with role-based access scope.",
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {
    "content-type-builder": {
      visible: false,
    },
  },
  attributes: {
    key: {
      type: "string",
      required: true,
      unique: true,
    },
    value: {
      type: "text",
      required: true,
    },
    roles: {
      type: "relation",
      relation: "manyToMany",
      target: "admin::role",
      required: true,
    },
  },
};
