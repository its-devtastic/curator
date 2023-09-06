import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  index() {
    return strapi.plugin("curator").service("dashboardService").getData();
  },
});
