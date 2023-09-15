import secretSchema from "./secret";
import auditSchema from "./audit";
import versionSchema from "./version";

export default {
  "curator-secret": { schema: secretSchema },
  "curator-audit-log": { schema: auditSchema },
  "curator-version": { schema: versionSchema },
};
