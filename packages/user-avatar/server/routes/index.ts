export default [
  {
    method: "GET",
    path: "/avatar",
    handler: "userAvatarController.getAvatar",
    config: {},
  },
  {
    method: "PATCH",
    path: "/avatar",
    handler: "userAvatarController.updateAvatar",
    config: {},
  },
];
