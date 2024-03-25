import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getAvatar() {
    return strapi.plugin("curator").service("userAvatarService").getAvatar();
  },
  updateAvatar() {
    return strapi.plugin("curator").service("userAvatarService").updateAvatar();
  },
});
