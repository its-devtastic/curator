import { Strapi } from "@strapi/strapi";
import * as R from "ramda";

export default ({ strapi }: { strapi: Strapi }) => ({
  async findMany() {
    const ctx = strapi.requestContext.get();
    const { params, state, query } = ctx;
    /*
     * There is no point in versioning content types that do not exist.
     */
    if (!strapi.contentTypes[params.uid]) {
      ctx.status = 404;
      return { message: "No content type with this UID not found" };
    }
    /*
     * Get all permissions of the current user.
     */
    const permissions =
      await strapi.admin.services.permission.findUserPermissions(state.user);
    /*
     * Check if the user has read permission on the content type.
     */
    const hasPermission = permissions.some(
      R.whereEq({
        subject: params.uid,
        action: `plugin::content-manager.explorer.read`,
      })
    );

    if (!hasPermission) {
      ctx.status = 403;
      return { message: "You don't have read permissions on the content type" };
    }

    const page =
      Number.isInteger(Number(query.page)) && query.page > 0
        ? Number(query.page)
        : 1;

    const entities = await strapi.entityService.findMany(
      "plugin::curator.curator-version",
      {
        sort: "version:DESC",
        start: (page - 1) * 10,
        limit: 10,
        populate: {
          createdBy: {
            fields: ["id", "firstname", "lastname"],
          },
        },
        filters: {
          objectId: {
            $eq: params.id,
          },
          objectUid: {
            $eq: params.uid,
          },
        },
      }
    );

    const count = await strapi.entityService.count(
      "plugin::curator.curator-version",
      {
        filters: {
          objectId: {
            $eq: params.id,
          },
          objectUid: {
            $eq: params.uid,
          },
        },
      }
    );

    return {
      pagination: {
        page,
        pageCount: Math.ceil(count / 10),
        pageSize: 10,
        total: count,
      },
      results: Array.isArray(entities)
        ? entities.map(
            R.pick(["id", "content", "version", "createdAt", "createdBy"])
          )
        : [],
    };
  },
});
