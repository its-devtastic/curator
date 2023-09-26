import type { Strapi } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import * as R from "ramda";

const AUDIT_LOG_UID = "plugin::curator.curator-audit-log";

export default function auditLifecycle(strapi: Strapi) {
  /*
   * Subscribe to all lifecycle events to create an audit trail.
   */
  strapi.db.lifecycles.subscribe(async (event) => {
    const config = strapi.plugin("curator").config("audit");
    const include: string[] = Array.isArray(config?.include)
      ? config.include
      : [];
    const exclude: string[] = Array.isArray(config?.exclude)
      ? config.exclude
      : [];
    const uidMatch =
      R.anyPass([
        R.startsWith("api::"),
        R.includes(R.__, include),
        R.equals("plugin::curator.curator-secret"),
      ])(event.model?.uid ?? "") && !exclude.includes(event.model?.uid);

    if (
      config &&
      uidMatch &&
      ["afterCreate", "afterUpdate", "afterDelete"].includes(event.action)
    ) {
      try {
        await strapi.entityService.create(AUDIT_LOG_UID, {
          data: {
            action: event.action.replace("after", "").toLowerCase(),
            objectUid: event.model.uid,
            objectId: R.unless(R.isNil, String)((event as any).result.id),
            subjectId: R.unless(
              R.isNil,
              String,
            )((event as any).result.createdBy?.id),
            subjectUid: "admin::user",
          },
        });
      } catch (e) {
        console.warn(e);
      }
    }
  });

  /*
   * Make sure audit logs cannot be updated or deleted.
   */
  strapi.db.lifecycles.subscribe({
    models: [AUDIT_LOG_UID],

    beforeUpdate() {
      throw new errors.ForbiddenError("Action not allowed");
    },

    beforeDelete() {
      throw new errors.ForbiddenError("Action not allowed");
    },
  } as any);
}
