import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  index() {
    return strapi
      .plugin("curator-secrets")
      .service("secretsService")
      .getSecrets();
  },
});
