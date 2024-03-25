export default {
  kind: "collectionType",
  collectionName: "curator_user_avatar",
  info: {
    singularName: "curator-user-avatar",
    pluralName: "curator-user-avatars",
    displayName: "Curator Admin User Avatars",
    description: "Avatars for admin users.",
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
    user: {
      type: "relation",
      relation: "oneToOne",
      target: "admin::user",
    },
    avatar: {
      type: "media",
      multiple: false,
      allowedTypes: ["images"],
    },
  },
};
