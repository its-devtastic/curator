import { Strapi } from "@strapi/strapi";

const PROFILE_UID = "plugin::curator.curator-admin-user-profile";

export default ({ strapi }: { strapi: Strapi }) => ({
  async getAvatar() {
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    const query = await strapi.entityService!.findMany(PROFILE_UID, {
      filters: {
        user: user.id,
      },
      populate: ["avatar"],
    });

    return Array.isArray(query) ? query[0] : {};
  },

  async updateAvatar() {
    const ctx = strapi.requestContext.get();
    const user = ctx.state.user;

    const query = await strapi.entityService!.findMany(PROFILE_UID, {
      filters: {
        user: user.id,
      },
    });

    if (Array.isArray(query) && query[0]) {
      return await strapi.entityService!.update(PROFILE_UID, query[0].id, {
        data: ctx.request.body,
        populate: ["avatar"],
      });
    }
  },
});
