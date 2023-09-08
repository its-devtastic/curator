export default {
  kind: "collectionType",
  collectionName: "curator_version",
  info: {
    singularName: "curator-version",
    pluralName: "curator-versions",
    displayName: "Curator Version",
    description: "A snapshot of a content entity.",
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
    objectId: {
      type: "string",
    },
    objectUid: {
      type: "string",
    },
    content: {
      type: "json",
      required: true,
    },
    version: {
      type: "integer",
      required: true,
    },
    createdBy: {
      type: "relation",
      relation: "manyToOne",
      target: "admin::user",
    },
  },
};
