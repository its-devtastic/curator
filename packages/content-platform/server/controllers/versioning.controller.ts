import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  /*
   * Endpoint for retrieving versions of a content item. User should have read
   * permissions on the content type in order to access its versions.
   */
  list() {
    return strapi.plugin("curator").service("versioningService").findMany();
  },
});
