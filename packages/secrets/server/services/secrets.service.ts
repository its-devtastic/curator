import { Strapi } from "@strapi/strapi";
import * as R from "ramda";

export default ({ strapi }: { strapi: Strapi }) => ({
  async getSecrets() {
    const ctx = strapi.requestContext.get();
    const userRoles = ctx.state.user.roles.map(({ id }: { id: number }) => id);
    const isAdmin = ctx.state.user.roles.some(
      R.whereEq({ code: "strapi-super-admin" })
    );
    const query = await strapi.entityService!.findMany(
      "plugin::curator-secrets.curator-secret",
      {
        filters: isAdmin ? undefined : { roles: userRoles },
      }
    );

    return (
      query?.reduce(
        (
          result: Record<string, string>,
          { key, value }: { key: string; value: string }
        ) => ({
          ...result,
          [key]: value,
        }),
        {}
      ) ?? {}
    );
  },
});
