import type { Strapi } from "@strapi/strapi";
import * as R from "ramda";

const ADMIN_USER_UID = "admin::user";
const PROFILE_UID = "plugin::curator.curator-admin-user-profile";

export default async function profileLifecycle(strapi: Strapi) {
  /*
   * Make sure admin users always have a profile
   */
  const admins = (await strapi.entityService.findMany(ADMIN_USER_UID)) as any[];

  const existingProfiles = (await strapi.entityService.findMany(PROFILE_UID, {
    filters: {
      user: R.pluck("id", admins),
    },
    populate: ["user"],
  })) as any[];

  const adminsWithoutProfile = R.without(
    existingProfiles.map(R.path(["user", "id"])),
    R.pluck("id", admins),
  );

  for await (const adminId of adminsWithoutProfile) {
    await strapi.entityService.create(PROFILE_UID, { data: { user: adminId } });
  }

  strapi.db.lifecycles.subscribe({
    models: [ADMIN_USER_UID],

    async afterCreate({ result }: any) {
      await strapi.entityService.create(PROFILE_UID, {
        data: { user: result.id },
      });
    },

    async afterDelete({ result }: any) {
      const items = await strapi.entityService.findMany(PROFILE_UID, {
        filters: { user: result.id },
      });

      if (Array.isArray(items) && items[0]) {
        await strapi.entityService.delete(PROFILE_UID, items[0].id);
      }
    },
  } as any);
}
