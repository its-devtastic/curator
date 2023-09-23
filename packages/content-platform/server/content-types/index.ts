import secretSchema from "./secret";
import auditSchema from "./audit";
import versionSchema from "./version";
import profileSchema from "./profile";

export default {
  "curator-secret": { schema: secretSchema },
  "curator-audit-log": { schema: auditSchema },
  "curator-version": { schema: versionSchema },
  "curator-admin-user-profile": { schema: profileSchema },
};
