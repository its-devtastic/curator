import type { Strapi } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import * as R from "ramda";
import dayjs from "dayjs";
import { PluginConfig } from "../types";

const VERSION_UID = "plugin::curator.curator-version";
// Default throttle time in minutes
const DEFAULT_THROTTLE = 5;

const NON_VERSIONED_FIELDS = [
  "id",
  "createdAt",
  "updatedAt",
  "createdBy",
  "updatedBy",
  "publishedAt",
  "localizations",
  "locale",
];

export default function versioningLifecycle(strapi: Strapi) {
  const config: PluginConfig["versioning"] = strapi
    .plugin("curator")
    .config("versioning");

  /*
   * Throttle time can be configured in the plugin options. If none is provided
   * we take a default time of 5 minutes.
   */
  const throttleTime = R.unless(
    (value) => typeof value === "number",
    R.always(DEFAULT_THROTTLE),
  )(R.prop<number>("throttle", config)) as number;
  /*
   * Make sure versions cannot be updated.
   */
  strapi.db.lifecycles.subscribe({
    models: [VERSION_UID],

    beforeUpdate() {
      throw new errors.ForbiddenError("Action not allowed");
    },
  } as any);

  /*
   * Create new version on content update.
   */
  config &&
    strapi.db.lifecycles.subscribe(async (event) => {
      if (event.action === "beforeUpdate") {
        const { data, where } = event.params;
        const id = where.id || data.id;

        /*
         * When versioning is enabled on the content type it applies to
         * all fields that are writable. Some fields are not marked as writable
         * but excluded anyway because versioning doesn't make sense for them.
         */
        const allFields =
          strapi.contentTypes[event.model.uid]?.pluginOptions?.versioning;
        /*
         * When versioning is not enabled on the content type, we look for
         * versioning on the field level.
         */
        const fields = allFields
          ? Object.entries(event.model.attributes)
              .filter(
                ([key, attribute]: [string, any]) =>
                  attribute.writable !== false &&
                  attribute.type !== "relation" &&
                  !NON_VERSIONED_FIELDS.includes(key),
              )
              .map<string>(R.head)
          : Object.entries(event.model.attributes)
              .filter(
                ([_, attribute]: [string, any]) =>
                  attribute.pluginOptions?.versioning,
              )
              .map<string>(R.head);

        /*
         * Only continue if there are any fields to version.
         */
        if (id && !R.isEmpty(fields)) {
          const current = await strapi.entityService.findOne(
            event.model.uid as any,
            id,
          );
          /*
           * If for some reason we cannot get the current entity there is no
           * point in continuing.
           */
          if (!current) {
            return;
          }
          /*
           * Get the last version.
           */
          const lastVersion = (await strapi.entityService.findMany(
            VERSION_UID,
            {
              sort: "version:DESC",
              limit: 1,
              filters: {
                objectId: id,
                objectUid: event.model.uid,
              },
            },
          )) as any[];

          const hasChanges = !R.equals(
            R.pick(fields, current),
            R.pick(fields, data),
          );

          const published =
            R.isNil(current.publishedAt) && !R.isNil(data.publishedAt);

          const timeAfterLastVersion = lastVersion[0]
            ? dayjs().diff(lastVersion[0].createdAt, "minutes")
            : Infinity;

          if (hasChanges && timeAfterLastVersion >= throttleTime) {
            await strapi.entityService.create(VERSION_UID, {
              data: {
                objectId: String(id),
                objectUid: event.model.uid,
                version: lastVersion[0] ? lastVersion[0].version + 1 : 1,
                content: R.when(
                  R.always(published),
                  R.assoc("published", published),
                )(R.pick(fields, current)),
                createdBy: data.updatedBy || data.createdBy,
              },
            });
          }
        }
      }
    });
}
