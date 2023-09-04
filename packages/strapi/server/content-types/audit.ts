export default {
  kind: "collectionType",
  collectionName: "curator_audit_log",
  info: {
    singularName: "curator-audit-log",
    pluralName: "curator-audit-logs",
    displayName: "Curator Audit Log",
    description: "A log of an action of a user.",
  },
  options: {
    draftAndPublished: false,
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
    action: {
      type: "string",
      required: true,
    },
    subjectId: {
      type: "string",
    },
    subjectUid: {
      type: "string",
    },
  },
};
