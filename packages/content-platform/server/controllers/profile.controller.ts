import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getMe() {
    return strapi.plugin("curator").service("profileService").getMe();
  },
  updateMe() {
    return strapi.plugin("curator").service("profileService").updateMe();
  },
});
