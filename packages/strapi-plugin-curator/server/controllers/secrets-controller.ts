import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  find() {
    return strapi.plugin("curator").service("secretsService").getSecrets();
  },
});
