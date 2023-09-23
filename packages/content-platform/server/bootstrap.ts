import type { Strapi } from "@strapi/strapi";

import versioningLifecycle from "./lifecycles/versioning.lifecycle";
import auditLifecycle from "./lifecycles/audit.lifecycle";
import profileLifecycle from "./lifecycles/profile.lifecycle";

export default async function ({ strapi }: { strapi: Strapi }) {
  /*
   * Set up audit lifecycle hooks.
   */
  auditLifecycle(strapi);
  /*
   * Set up versioning lifecycle hooks.
   */
  versioningLifecycle(strapi);
  /*
   * Set up admin user profile lifecycle hooks.
   */
  profileLifecycle(strapi);
}
