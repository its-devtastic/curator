export default {
  kind: "collectionType",
  collectionName: "curator_admin_user_profile",
  info: {
    singularName: "curator-admin-user-profile",
    pluralName: "curator-admin-user-profiles",
    displayName: "Curator Admin User Profile",
    description: "A profile for admin users.",
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
