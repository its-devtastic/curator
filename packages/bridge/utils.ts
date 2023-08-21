import cookie from "cookie";

import { CURATOR_BRIDGE_USER_TOKEN } from "./constants";

export async function isAdminUser(
  headers: Headers,
  opts: { strapiUrl?: string } = {}
): Promise<boolean> {
  const STRAPI_URL =
    opts.strapiUrl ?? process.env.CURATOR_STRAPI_URL ?? process.env.STRAPI_URL;
  const cookieString = headers.get("Cookie") ?? "";

  const token = cookie.parse(cookieString)[CURATOR_BRIDGE_USER_TOKEN];

  if (!token) {
    return false;
  }

  if (!STRAPI_URL) {
    console.error(
      "[Curator Bridge] Could not find Strapi URL. See documentation on how to configure it: https://www.curatorjs.org/docs/bridge/preview-mode"
    );
    return false;
  }

  try {
    const response = await fetch(`${STRAPI_URL}/admin/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = (await response.json()).data;

    return Boolean(user.isActive);
  } catch (e) {
    console.error(e);
    return false;
  }
}
