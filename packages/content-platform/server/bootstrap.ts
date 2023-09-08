import type { Strapi } from "@strapi/strapi";

import versioningLifecycle from "./lifecycles/versioning.lifecycle";
import auditLifecycle from "./lifecycles/audit.lifecycle";

export default async function ({ strapi }: { strapi: Strapi }) {
  /*
   * Set up audit lifecycle hooks.
   */
  auditLifecycle(strapi);
  /*
   * Set up versioning lifecycle hooks.
   */
  versioningLifecycle(strapi);
}
